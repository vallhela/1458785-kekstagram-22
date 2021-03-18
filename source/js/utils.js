/**
 * Implementation from https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */

const getRandomNumber = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const isValidLength = function (text, maxLength) {
  return text.length <= maxLength;
}

const getRandomArrayElement = (elements) => {
  return elements[getRandomNumber(0, elements.length - 1)];
};

const getRandomUniqueArrayElements = (elements, maxCount) => {
  if (elements.length <= maxCount) {
    return elements.slice();
  }
  const result = new Set();
  while (result.size < maxCount) {
    result.add(getRandomArrayElement(elements));
  }
  return Array.from(result);
};

const removeChildren = function (parent) {
  for (let i = parent.children.length - 1; i >= 0; i--) {
    const child = parent.children[i];
    child.parentElement.removeChild(child);
  }
};

const isEscEvent = (evt) => {
  return evt.key === ('Escape' || 'Esc');
};

export {removeChildren, isValidLength, isEscEvent, getRandomUniqueArrayElements};
