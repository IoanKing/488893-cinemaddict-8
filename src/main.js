import Selector from "./selectors";
import {renderFilterList, renderCardList, refreshCollection} from "./render";
import {DEFAULT_MOVIE_COUNT, getMockCollection, FilterMockData} from "./mock";

const DEFAULT_EXTRA_COUNT = 2;
const MAX_MOVIE_COUNT = 20;

const navigation = document.querySelector(`.${Selector.NAVIGATION}`);

/**
 * Обработчик события клика на активный фильтр - запускает обновление списка карточек задач.
 * @param {object} evt объект события Event - нажатия клика.
 */
const onFilterClick = (evt) => {
  evt.preventDefault();
  if (evt.target.classList.contains(`${Selector.NAVIGATION_ITEM}`)) {
    const span = evt.target.querySelector(`span`);
    const filterCount = (span) ? +span.textContent : DEFAULT_MOVIE_COUNT;
    refreshCollection(Math.min(filterCount, MAX_MOVIE_COUNT));
  }
};

/**
 * Инициализация скриптов для сайта.
 *  Запускает фнукцию отрисовки фильтров;
 *  Запускает функцию генерации случайной коллекции задач;
 *  Запускает функцию орисовки карточек задач;
 *  Запускает обработкик обработки клика на фильтр.
 */
const init = () => {
  renderFilterList(FilterMockData);
  const randomData = getMockCollection(DEFAULT_MOVIE_COUNT);
  const randomTop = getMockCollection(DEFAULT_EXTRA_COUNT);
  const randomComment = getMockCollection(DEFAULT_EXTRA_COUNT);
  renderCardList(randomData, Selector.ALL_MOVIE, true);
  renderCardList(randomTop, Selector.TOP_MOVIE);
  renderCardList(randomComment, Selector.COMMENTED_MOVIE);

  navigation.addEventListener(`click`, onFilterClick);
};

init();
