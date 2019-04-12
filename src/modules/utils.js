const MIN_COUNT = 0;
const MAX_COUNT = 30;

const MAX_RATING = 9;

const DEFAULT_EXTRA_COUNT = 2;
const MOVIE_SHOW_COUNT = 5;

const ENTER_KEYCODE = 10;
const ESC_KEYCODE = 27;

const DEBOUNCE_INTERVAL = 600;

const Emoji = {
  "sleeping": `😴`,
  "neutral-face": `😐`,
  "grinning": `😀`,
};

const ChartSettings = {
  BAR_HEIGHT: 50,
  BACKGROUND_COLOR: `#ffe800`,
  COLOR: `#ffffff`,
  FONT_SIZE: 20,
};

const FiltersName = {
  FAVORITES: `favorites`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  ALL: `all`,
  SEARCH: `search`,
  TOP_RATED: `top-rated`,
  TOP_COMMENTED: `top-commented`,
};

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

/**
 * Создание DOM элемента на основании шаблона.
 * @param {object} elementTemplate шаблон DOM элемента.
 * @param {bool} isMultiplyElement признак нескольких элементов в шаблоне.
 * @return {object} DOM элемент.
 */
const createElement = (elementTemplate, isMultiplyElement = false) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = elementTemplate;
  return (isMultiplyElement) ? newElement : newElement.firstChild;
};

/**
 * Генерация случайной строки
 * @param {number} n Количество символов в генерируемой строке
 * @return {string} Сгенерированная строка
 */
const getRandomString = (n = 15) => {
  let s = ``;
  let abd = `abcdefghijklmnopqrstuvwxyz0123456789=`;
  let aL = abd.length;
  while (s.length < n) {
    s += abd[Math.random() * aL | 0];
  }
  return s;
};

/**
 * debounce
 *
 * @param { function } cb Callback to be executed after debounce
 * @param { int } wait Time to wait before function execution
 * @return {function(...[*])}
 */
const debounce = (cb, wait = DEBOUNCE_INTERVAL) => {
  let timeout = null;

  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(cb(), wait);
  };
};

export {
  getRandomInt,
  getRandomElement,
  getRandomFloat,
  createElement,
  DEFAULT_EXTRA_COUNT,
  MOVIE_SHOW_COUNT,
  Emoji,
  MAX_RATING,
  ChartSettings,
  getRandomString,
  ENTER_KEYCODE,
  ESC_KEYCODE,
  debounce,
  FiltersName
};
