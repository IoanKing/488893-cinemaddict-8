import Selector from "./selectors";
import FilmList from "./film-list";
import FilmDetail from "./film-details";
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

const onOpenPopup = (collection) => {
  const popup = new FilmDetail(collection);
  popup.container = body;
  popup.render();
  popup.onClose = onClosePopup.bind(popup);
};

const onClosePopup = (collection) => {
  collection.unrender();
};

/**
 * Инициализация скриптов для сайта.
 *  Запускает фнукцию отрисовки фильтров;
 *  Запускает функцию генерации случайной коллекции задач;
 *  Запускает функцию орисовки карточек задач;
 *  Запускает обработкик обработки клика на фильтр.
 */
const init = () => {
  const filmList = new FilmList();
  const filterList = new FilterList();
  filmList.onClick = onOpenPopup;
  filterList.onFilmList = filmList;
  filterList.render(navigation);

  filmList.defaultContainer = filmContainer;

  filmList.Filter = filterDefault;
  filmList.render();

  filmList.Filter = filterTopRated;
  filmList.render(topFilmContainer, false);

  filmList.Filter = filterTopComment;
  filmList.render(commentedFilmContainer, false);
};

init();
