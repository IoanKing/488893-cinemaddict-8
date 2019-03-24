import Selector from "./selectors";
import FilmList from "./film-list";
import FilterList from "./filter-list";
import {DEFAULT_EXTRA_COUNT, MAX_MOVIE_COUNT} from "./utils";

const navigation = document.querySelector(`.${Selector.NAVIGATION}`);
const filmContainer = document.querySelector(`.${Selector.CONTAINER}`);
const topFilmContainer = document.querySelector(`#${Selector.TOP_MOVIE}`);
const commentedFilmContainer = document.querySelector(`#${Selector.COMMENTED_MOVIE}`);
const body = document.querySelector(`${Selector.BODY}`);

const filterDefault = (collection) => {
  return Object.values(collection).slice(0, Math.min(MAX_MOVIE_COUNT, collection.length));
};

const filterTopRated = (collection) => {
  return Object.values(collection).sort((a, b) => b._rating - a._rating).slice(0, DEFAULT_EXTRA_COUNT);
};

const filterTopComment = (collection) => {
  return Object.values(collection).sort((a, b) => b._comments.length - a._comments.length).slice(0, DEFAULT_EXTRA_COUNT);
};

/**
 * Инициализация скриптов для сайта.
 *  Запускает фнукцию отрисовки фильтров;
 *  Запускает функцию генерации случайной коллекции задач;
 *  Запускает функцию орисовки карточек задач;
 *  Запускает обработкик обработки клика на фильтр.
 */
const init = () => {
  const filmList = new FilmList(filmContainer);
  filmList.popupContainer = body;
  const filterList = new FilterList();
  filterList.onFilmList = filmList;
  filterList.render(navigation);

  filmList.Filter = filterDefault;
  filmList.isShowDetail = true;
  filmList.render(filmContainer);

  filmList.Filter = filterTopRated;
  filmList.isShowDetail = false;
  filmList.render(topFilmContainer, false);

  filmList.Filter = filterTopComment;
  filmList.isShowDetail = false;
  filmList.render(commentedFilmContainer, false);
};

init();
