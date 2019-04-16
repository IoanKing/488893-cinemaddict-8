import moment from "moment";

const ENTER_KEYCODE = 10;
const ESC_KEYCODE = 27;

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

const PeriodNames = new Map();
PeriodNames.set(`today`, `day`);
PeriodNames.set(`week`, `week`);
PeriodNames.set(`month`, `month`);
PeriodNames.set(`year`, `year`);

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
 * Возвращает коллекцию отфильтрованную по заданному периоду.
 * @param {object} collection - обрабатываемая коллекция.
 * @param {string} periodName - наименование периода.
 * @return {object} - отфильтрованная коллекция.
 */
const getFilteredData = (collection, periodName = `year`) => {
  if (PeriodNames.has(periodName)) {
    return Object.values(collection).filter((it) => moment(it.watchedDate).isBetween(moment().startOf(PeriodNames.get(periodName)), moment().endOf(PeriodNames.get(periodName))));
  }
  return collection;
};

export {
  createElement,
  Emoji,
  ChartSettings,
  getRandomString,
  ENTER_KEYCODE,
  ESC_KEYCODE,
  FiltersName,
  getFilteredData
};
