import * as fs from 'fs';
import * as path from 'path';
import Ast from 'ts-simple-ast';
import { createWrappedNode, InterfaceDeclaration, PropertySignature, Symbol } from 'ts-simple-ast';
import * as ts from 'typescript';

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

    // get object values
    const values = parse(element.content);

    // the interface we are looking for
    const namedInterface = values.interface.trim();

    // does the interface exist in current file?
    const interfacePath = values.path ? values.path.trim() : filename;

    // does the interface exist in current file?
    const matchedInterface = getInterface(interfacePath, namedInterface);

    // if interface found do something with it
    if (matchedInterface) {

      // create array of new elements
      const newElements = [];

      setElements(matchedInterface, interfacePath, newElements, values);

      // console.log(newElements);

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
 * Finds the required interface
 * @param filename
 * @param namedInterface
 */
function getInterface(interfacePath, namedInterface) {

  // reference to current file
  const interfaceFile = ast.getOrAddSourceFileFromFilePath(interfacePath);

  const matchedInterface = interfaceFile.getInterface(namedInterface);

  // does the interface exist in current file?
  return matchedInterface;

}

/**
 *
 * @param properties
 * @param filename
 * @param new_elements
 * @param values
 * @param inttype
 */
function setElements(matchedInterface, filename, newElements, values, inttype?) {

  const properties = matchedInterface.getProperties();

  properties.forEach((prop: any) => {

    const name = prop.getName();

    let propType = prop.getType().getText();

    const description = prop.getDocumentationComment() || '&nbsp;';

    const typeDef = inttype ? `${inttype}.${prop.getName()}` : prop.getName();

    let typeInterface;

    console.log('type', propType);

    if (propType !== 'boolean' && propType !== 'string' && propType !== 'number') {
      typeInterface = getInterface(filename, propType.replace('[]', ''));
      if (!typeInterface) {
        propType = prop.getName();
      }
    }

    newElements.push({
      content: `{${capitalize(propType)}} ${typeDef} ${description}\n`,
      name: 'apisuccess',
      source: `@apiSuccess {${capitalize(propType)}} ${typeDef} ${description}\n`,
      sourceName: 'apiSuccess',
    });

    if (propType !== 'boolean' && propType !== 'string' && propType !== 'number') {

      if (typeInterface) {

        setElements(typeInterface, filename, newElements, values, typeDef);

      } else {

        prop.getType().getProperties().forEach((property) => {
          const valueDeclaration = property._compilerSymbol.valueDeclaration;
          const propName = property.getName();
          propType = valueDeclaration.type.getText();
          const desc = valueDeclaration.jsDoc ? valueDeclaration.jsDoc[0].comment : '&nbsp;';

          newElements.push({
            content: `{${capitalize(propType)}} ${typeDef}.${propName} ${desc}\n`,
            name: 'apisuccess',
            source: `@apiSuccess {${capitalize(propType)}} ${typeDef}.${propName} ${desc}\n`,
            sourceName: 'apiSuccess',
          });

          if (propType !== 'boolean' && propType !== 'string' && propType !== 'number') {
            typeInterface = getInterface(filename, propType);
            if (typeInterface) {
              setElements(typeInterface, filename, newElements, values, typeDef + '.' + propName);
            } else {
              propType = prop.getName();
            }
          }
        });
      }
    }

  });

}

/**
 * Helper method to capitlise firt letter of type
 */
function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
