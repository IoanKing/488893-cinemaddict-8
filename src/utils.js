const MIN_COUNT = 0;
const MAX_COUNT = 30;

/**
 * Генерация случайного числа на заданном интервале.
 * @param {number} min минимальное значение интервала.
 * @param {number} max максимальнео значение интервала.
 * @return {number} сгенерированное число.
 */
const getRandomInt = (min = MIN_COUNT, max = MAX_COUNT) => Math.floor(Math.random() * (max - min)) + min;

/**
 * Генерация случайного дробного числа на заданном интервале.
 * @param {number} min минимальное значение интервала.
 * @param {number} max максимальнео значение интервала.
 * @return {number} сгенерированное дробное число.
 */
const getRandomFloat = (min = MIN_COUNT, max = MAX_COUNT) => getRandomInt(min, max) + Math.floor(Math.random() * 10) / 10;

/**
 * Выбор случайного элемента из коллекции объектов.
 * @param {object} collection коллекция объектов.
 * @return {object} элемент коллекции объектов.
 */
const getRandomElement = (collection) => collection[getRandomInt(0, collection.length)];

export {getRandomInt, getRandomElement, getRandomFloat};
