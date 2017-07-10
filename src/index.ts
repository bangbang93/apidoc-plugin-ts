import * as path from "path";
import Ast from "ts-simple-ast";

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
    const namedInterface = values.interface;

    // does the interface exist in current file?
    const matchedInterface = getInterface(filename, namedInterface);

    // if interface found do something with it
    if (matchedInterface) {

      // create array of new elements
      const newElements = [];
      setElements(matchedInterface, filename, newElements, values);

      // push new elements into existing elements
      for (let i = 0, l = newElements.length; i < l; i++) {
        elements.push(newElements[i]);
      }

    } else {
      console.log('could not find interface ' + namedInterface);
    }

  }

  return elements;
}

/**
 * Parse element content
 * @param content
 */
function parse(content) {

  if (content.length === 0)
    return null;

  var parseRegExp = /^(?:{(.+?)})(?:(.+))?/g;
  var matches = parseRegExp.exec(content);

  if (!matches)
    return null;

  return {
    interface: matches[1].trim(),
    element: matches[2].trim() || 'apiSuccess',
  };
}

/**
 * Finds the required interface
 * @param filename 
 * @param namedInterface 
 */
function getInterface(filename, namedInterface) {

  // reference to current file
  const currentFile = ast.getOrAddSourceFileFromFilePath(filename);

  // does the interface exist in current file?
  let matchedInterface = currentFile.getInterface(namedInterface);

  // if interface not in current file look in imports
  if (!matchedInterface) {
    currentFile.getImports().forEach((imp) => {
      const modulePath = path.join(path.dirname(filename), `${imp.getModuleSpecifier()}.ts`);
      const importSourceFile = ast.getOrAddSourceFileFromFilePath(modulePath);
      const sourceFileInterface = importSourceFile.getInterface(namedInterface);
      if (sourceFileInterface) {
        matchedInterface = sourceFileInterface;
      }
    });
  }

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

  properties.forEach((prop) => {

    const name = prop.getName();

    console.log('name',name);

    const type = prop.getType().getText();

    const description = prop.getDocumentationComment() || '';

    const typeDef = inttype ? `${inttype}.${prop.getName()}` : prop.getName();



    newElements.push({
      source: `@apiSuccess {${capitalize(type)}} ${typeDef} ${description}\n`,
      name: 'apisuccess',
      sourceName: 'apiSuccess',
      content: `{${capitalize(type)}} ${typeDef} ${description}\n`
    });

    if (type !== 'boolean' && type !== 'string' && type !== 'number') {
      const typeInterface = getInterface(filename, type);
      if (typeInterface) {
        setElements(typeInterface, filename, newElements, values, typeDef);
      } else {
        
        //const props = JSON.parse(type);
        //console.log(props);
      }
    }

  });

}

/**
 * Helper method to capitlise firt letter of type
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}