const shuffleArray = (array) => {
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

const getObjectValue = (object, attribs) => {
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

module.exports = {
  shuffleArray,
  getObjectValue
}
