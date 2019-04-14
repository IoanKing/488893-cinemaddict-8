import Selector from "./selectors";
import Settings from "./settings";
import {FiltersName} from "./utils";

/**
 * Фильтрация коллекции обьектов.
 * @param {object} films - коллекция обьектов.
 * @param {string} filterName - наименование фильтра.
 * @param {string} text - Поисковая фраза.
 * @return {object} - отфильтрованная коллекция.
 */
const filterFilms = (films, filterName, text = ``) => {
  let data = {};
  switch (filterName) {
    case FiltersName.FAVORITES:
      data = Object.values(films).filter((it) => it.isFavorites);
      break;
    case FiltersName.WATCHLIST:
      data = Object.values(films).filter((it) => it.isWatchList);
      break;
    case FiltersName.HISTORY:
      data = Object.values(films).filter((it) => it.isWatched);
      break;
    case FiltersName.ALL:
      data = Object.values(films);
      break;
    case FiltersName.SEARCH:
      const regMatch = new RegExp(`${(text.length > 0) ? `${text.trim()}` : ``}`, `i`);
      data = Object.values(films).filter((it) => (regMatch.test(it.title) || regMatch.test(it.original)));
      break;
    case FiltersName.TOP_RATED:
      data = Object.values(films).sort((a, b) => b.totalRating - a.totalRating).slice(0, Settings.DEFAULT_EXTRA_COUNT);
      break;
    case FiltersName.TOP_COMMENTED:
      data = Object.values(films).sort((a, b) => b.comments.length - a.comments.length).slice(0, Settings.DEFAULT_EXTRA_COUNT);
      break;
    default:
      data = Object.values(films);
      break;
  }
  return data;
};

/**
 * Получение отфильтрованной коллекции.
 * @param {*} collection - Начальная коллекция данных
 * @return {array} Массив с отфильтрованной коллекцией данных.
 */
const getFilters = (collection) => {
  return [
    {
      title: `Favorites`,
      slug: `favorites`,
      isWatched: false,
      count: Object.values(collection).reduce((sum, current) => +sum + +current.isFavorites, 0),
    },
    {
      title: `History`,
      slug: `history`,
      isWatched: false,
      count: Object.values(collection).reduce((sum, current) => +sum + +current.isWatched, 0),
    },
    {
      title: `Watchlist`,
      slug: `watchlist`,
      isWatched: false,
      count: Object.values(collection).reduce((sum, current) => +sum + +current.isWatchList, 0),
    },
    {
      title: `All movies`,
      slug: `all`,
      isWatched: false,
      count: collection.length,
    },
  ];
};

/**
 * установка Активности на фильтр.
 * @param {object} container - DOM элемент, со списком фильтров.
 * @param {string} filterName - наименование фильтра.
 * @param {string} currentFilter - текущий активный фильтр.
 * @return {string} - текущий активный фильтр.
 */
const setActiveFilter = (container, filterName) => {
  const filters = container.querySelectorAll(`.${Selector.NAVIGATION_ITEM}`);
  let activeFilter = null;
  filters.forEach((it) => {
    if (it.getAttribute(`href`)) {
      activeFilter = it.getAttribute(`href`).split(`#`).pop();
      it.classList.remove(Selector.NAVIGATION_ITEM_ACTIVE);
      if (activeFilter === filterName) {
        it.classList.add(Selector.NAVIGATION_ITEM_ACTIVE);
        filterName = it.getAttribute(`href`).split(`#`).pop();
      }
      const main = document.querySelector(`.${Selector.MAIN}`);
      const filmsContainer = main.querySelector(`.${Selector.FILMS}`);
      const statisticContainer = main.querySelector(`.${Selector.STATISTIC}`);
      filmsContainer.classList.remove(Selector.HIDDEN);
      if (statisticContainer) {
        main.removeChild(statisticContainer);
      }
    }
  });
  return filterName;
};

export {filterFilms, getFilters, setActiveFilter};
