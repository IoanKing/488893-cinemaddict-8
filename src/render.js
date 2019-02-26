import Selector from "./selectors";
import getCardElement from "./card_template";
import getFilterElement from "./filter_template";
import {MAX_MOVIE_COUNT, getMockCollection} from "./mock";

const navigation = document.querySelector(`.${Selector.NAVIGATION}`);

/**
 * Отрисовка фильтров.
 * @param {object} collection Коллекция обьектов "Фильтр".
 */
const renderFilterList = (collection) => {
  let isFirstElement = true;
  let fragment = ``;
  collection.forEach((element) => {
    fragment = fragment + getFilterElement(element, isFirstElement);
    isFirstElement = false;
  });
  navigation.insertAdjacentHTML(`afterbegin`, fragment);
};

/**
 * Отрисовка карточек фильмов.
 * @param {object} collection Коллекция обьектов "Карточки фильмов".
 * @param {string} section Селектор (блок) для вставки карточек.
 * @param {bool} isControls Признак наличия контролов на карточке.
 */
const renderCardList = (collection, section, isControls = false) => {
  const board = document.querySelector(`${section}`);
  board.innerHTML = ``;
  let fragment = ``;
  collection.forEach((element) => {
    fragment = fragment + getCardElement(element, isControls);
  });
  board.insertAdjacentHTML(`beforeend`, fragment);
};

/**
 * Обновление списка карточек фильмов.
 * Генерирует новый случайный список фильмов и выполняет их отрисовку.
 * @param {number} maxCount Максимальное количество карточек фильмов.
 */
const refreshCollection = (maxCount = MAX_MOVIE_COUNT) => {
  const newRandomData = getMockCollection(maxCount);
  renderCardList(newRandomData, Selector.ALL_MOVIE, true);
};

export {renderFilterList, renderCardList, refreshCollection};
