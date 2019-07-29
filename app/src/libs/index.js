export const capitalizeFirstLetter = (string) => {
  return string ? string[0].toUpperCase().concat(string.slice(1, string.length)) : ''
}

export const getObjectValue = (object, attribs) => {
  for (let attrib of attribs.split('.')) {
    if (object === null || object === undefined) {
      return ''
    }
    if (/\[0\]$/.test(attrib)) {
      // will work for [0] only
      let array = attrib.split(/\[0\]/)
      if (object[array[0]] === null || object[array[0]] === undefined) {
        return ''
      }
      object = object[array[0]][0]
    } else {
      if (object[attrib] === undefined || object[attrib] === null) {
        return ''
      }
      object = object[attrib]
    }
  }
  return object
}

export * from './state'
