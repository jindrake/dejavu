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

export const shuffleArray = (array) => {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

export const emailRegex = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
