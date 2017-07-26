import Ast, { InterfaceDeclaration } from 'ts-simple-ast';

const ast = new Ast();

/**
 * Initialise plugin (add app hooks)
 * @param app
 */
export function init(app) {
  app.addHook('parser-find-elements', parseElements, 200);
}

/**
 * Parse elements
 * @param elements
 * @param element
 * @param block
 * @param filename
 */
function parseElements(elements, element, block, filename) {

  // do something with the instance of our custom element
  if (element.name === 'apiinterface') {

    // remove the element
    elements.pop();

    // create array of new elements
    const newElements = [];

    // get object values
    const values = parse(element.content);

    // the interface we are looking for
    const namedInterface = values.interface.trim();

    // if it is an array get the correct name
    const isArray = namedInterface.includes('[]');
    if (isArray) {
      elements.push(
        getParam(
          `{Object[]} --root-- A collection of players. See <a href="#api-deepExtendsInterfaceTest">GetPlayer</a>`),
      );
      return;
    }

    // get the file path to the interface
    const interfacePath = values.path ? values.path.trim() : filename;

    // does the interface exist in current file?
    const matchedInterface = getInterface(interfacePath, namedInterface);

    // if interface found do something with it
    if (matchedInterface) {

      // match elemenets of current interface
      setInterfaceElements(matchedInterface, interfacePath, newElements, values);

      // push new elements into existing elements
      for (let i = 0, l = newElements.length; i < l; i++) {
        elements.push(newElements[i]);
      }

    } else {
      console.log(`Could not find interface ${namedInterface} in file ${interfacePath}`);
    }

  }

  return elements;
}

/**
 * Parse element content
 * @param content
 */
function parse(content) {

  if (content.length === 0) {
    return null;
  }

  const parseRegExp = /^(?:\((.+?)\)){0,1}\s*\{(.+?)\}\s*(?:(.+))?/g;
  const matches = parseRegExp.exec(content);

  if (!matches) {
    return null;
  }

  return {
    element: matches[3] || 'apiSuccess',
    interface: matches[2],
    path: matches[1],
  };
}

/**
 *
 * @param properties
 * @param filename
 * @param new_elements
 * @param values
 * @param inttype
 */
function setInterfaceElements(matchedInterface: InterfaceDeclaration, filename, newElements, values, inttype?) {

  // if this is an extended interface
  extendInterface(matchedInterface, filename, newElements, values, inttype);

  // iterate over interface properties
  matchedInterface.getProperties().forEach((prop) => {

    // set param type definition and description
    const typeDef = inttype ? `${inttype}.${prop.getName()}` : prop.getName();
    const descriptionPrefix = inttype ? `${inttype} > ` : '';
    const description = descriptionPrefix + (prop.getDocumentationComment() || prop.getName());

    // set property type as a string
    const propType = prop.getType().getText();

    // set property type label
    let propLabel = propType;

    // determine if the type is an object
    const propTypeIsObject = !isNativeType(propType);

    // if type is an object change label
    if (propTypeIsObject) {
      const isArray = propType.includes('[]');
      propLabel = 'Object' + (isArray ? '[]' : '');
    }

    // set the element
    newElements.push(getParam(`{${capitalize(propLabel)}} ${typeDef} ${description}`));

    // if property is an object or interface then we need to also display the objects properties
    if (propTypeIsObject) {

      // first determine if the object is an available interface
      const typeInterface = getInterface(filename, propType.replace('[]', ''));
      if (typeInterface) {
        setInterfaceElements(typeInterface, filename, newElements, values, typeDef);
      } else {
        setObjectElements(prop, filename, newElements, values, typeDef);
      }

    }

  });

}

/**
 * Set element if type object
 */
function setObjectElements(prop, filename, newElements, values, typeDef) {

    prop.getType().getProperties().forEach((property) => {

      const valueDeclaration = property._compilerSymbol.valueDeclaration;
      const propName = property.getName();
      const typeDefLabel = `${typeDef}.${propName}`;
      const propType = valueDeclaration.type.getText();
      const desc = (typeDef.replace(/\./g, ' &gt; ')) +
        ' &gt; ' + (valueDeclaration.jsDoc ? valueDeclaration.jsDoc[0].comment : propName);

      newElements.push(getParam(`{${capitalize(propType)}} ${typeDefLabel} ${desc}`));

      // if property is an object or interface then we need to also display the objects properties
      if (!isNativeType(propType)) {
        const typeInterface = getInterface(filename, propType);
        if (typeInterface) {
          setInterfaceElements(typeInterface, filename, newElements, values, typeDefLabel);
        } else {
          setObjectElements(property, filename, newElements, values, typeDef);
        }
      }

    });
}

/**
 * Extends the current interface
 * @param matchedInterface
 * @param interfacePath
 * @param newElements
 * @param values
 */
function extendInterface(matchedInterface: InterfaceDeclaration, interfacePath, newElements, values, inttype?) {
  const extendedInterface = matchedInterface.getExtends()[0];
  if (extendedInterface) {
    const extendedInterfaceName = matchedInterface.getExtends()[0].compilerNode.expression.getText();
    const matchedExtendedInterface = getInterface(interfacePath, extendedInterfaceName);
    extendInterface(matchedExtendedInterface, interfacePath, newElements, values);
    setInterfaceElements(matchedExtendedInterface, interfacePath, newElements, values, inttype);
  }
}

/**
 * Returns parameter object
 */
function getParam(param) {
  return {
    content: `${param}\n`,
    name: 'apisuccess',
    source: `@apiSuccess ${param}\n`,
    sourceName: 'apiSuccess',
  };
}

/**
 * Finds the required interface from a given file path
 * @param filename
 * @param namedInterface
 */
function getInterface(interfacePath, namedInterface) {
  const interfaceFile = ast.getOrAddSourceFileFromFilePath(interfacePath);
  return interfaceFile.getInterface(namedInterface);
}

/**
 * Helper method to capitlise firt letter of type
 */
function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 *
 * @param propType Returns true if a native type
 */
function isNativeType(propType) {
  const nativeTypes = ['boolean', 'string', 'number', 'Date'];
  return nativeTypes.indexOf(propType) >= 0;
}
