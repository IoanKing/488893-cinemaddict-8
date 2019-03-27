import Selector from "./selectors";
import mockdata from "./mock";
import Film from "./film";
import FilmDetail from "./film-details";
import Filter from "./filter";
import {DEFAULT_EXTRA_COUNT, MAX_MOVIE_COUNT} from "./utils";

const FilmList = mockdata;

const filtersContainer = document.querySelector(`.${Selector.NAVIGATION}`);
const filmContainer = document.querySelector(`.${Selector.CONTAINER}`);
const topFilmContainer = document.querySelector(`#${Selector.TOP_MOVIE}`);
const commentedFilmContainer = document.querySelector(`#${Selector.COMMENTED_MOVIE}`);
const body = document.querySelector(`${Selector.BODY}`);
let activeFilter = `all`;

/**
 * Обновляет струкутру объекта - меняет старый объект на новый.
 * @param {object} films - коллекция обьектов
 * @param {object} filmToUpdate - изменяемый обьект
 * @param {object} newFilm - новый обьект (изменяемые данные)
 * @return {object} обновленный элемент.
 */
const updateFilm = (films, filmToUpdate, newFilm) => {
  const index = films.findIndex((it) => it === filmToUpdate);
  films[index] = Object.assign({}, filmToUpdate, newFilm);
  FilmList[index] = Object.assign({}, filmToUpdate, newFilm);
  return films[index];
};

/**
 * Фильтрация коллекции обьектов.
 * @param {object} films - коллекция обьектов.
 * @param {string} filtername - наименование фильтра.
 * @return {object} - отфильтрованная коллекция.
 */
const filterFilms = (films, filtername) => {
  switch (filtername) {
    case `favorites`:
      return Object.values(films).filter((it) => it.isFavorites).slice(0, Math.min(MAX_MOVIE_COUNT, films.length));
    case `watchlist`:
      return Object.values(films).filter((it) => it.isWatchList).slice(0, Math.min(MAX_MOVIE_COUNT, films.length));
    case `history`:
      return Object.values(films).filter((it) => it.isWatched).slice(0, Math.min(MAX_MOVIE_COUNT, films.length));
    case `all`:
      return Object.values(films).slice(0, Math.min(MAX_MOVIE_COUNT, films.length));
    case `top-rated`:
      return Object.values(films).sort((a, b) => b.totalRating - a.totalRating).slice(0, DEFAULT_EXTRA_COUNT);
    case `top-commented`:
      return Object.values(films).sort((a, b) => b.comments.length - a.comments.length).slice(0, DEFAULT_EXTRA_COUNT);
    default:
      return Object.values(films).slice(0, Math.min(MAX_MOVIE_COUNT, films.length));
  }
};

/**
 * Отрисовка фильтров на странице.
 * @param {object} Films - коллекция обьектов.
 * @param {object} container - DOM элемент, в котором будет выполняться отрисовка.
 */
const renderFilters = (Films, container) => {
  const Filters = [
    {
      title: `Favorites`,
      slug: `favorites`,
      isWatched: false,
      count: Object.values(Films).reduce((sum, current) => +sum + +current.isFavorites, 0),
    },
    {
      title: `History`,
      slug: `history`,
      isWatched: false,
      count: Object.values(Films).reduce((sum, current) => +sum + +current.isWatched, 0),
    },
    {
      title: `Watchlist`,
      slug: `watchlist`,
      isWatched: false,
      count: Object.values(Films).reduce((sum, current) => +sum + +current.isWatchList, 0),
    },
    {
      title: `All movies`,
      slug: `all`,
      isWatched: false,
      count: Films.length,
    },
  ];

  for (const filter of Filters) {
    const filterComponent = new Filter(filter);

    container.insertAdjacentElement(`afterbegin`, filterComponent.render());
  }
};

/**
 * Отрисовка карточек фильмов на странице.
 * @param {object} Films - коллекция обьектов для торисовки.
 * @param {object} container - DOM элемент, в котором будет выполняться отрисовка.
 * @param {bool} isControl - признак отрисовки контролов для обьекта.
 */
const renderFilmList = (Films, container, isControl = false) => {
  container.innerHTML = ``;

  for (const film of Films) {
    const filmComponent = new Film(film);
    filmComponent.isShowDetail = isControl;

    container.appendChild(filmComponent.render());

    filmComponent.onAddToWatchList = (bool) => {
      film.isWatchList = bool;
    };

    filmComponent.onMarkAsWatched = (bool) => {
      film.isWatched = bool;
    };

    filmComponent.onMarkAsFavorite = (bool) => {
      film.isFavorites = bool;
    };

    filmComponent.onClick = () => {
      const filmDetailComponent = new FilmDetail(filmComponent.filmData);
      body.insertAdjacentElement(`beforeend`, filmDetailComponent.render());

      filmDetailComponent.onClose = (newObject) => {
        const updatedFilm = updateFilm(Films, film, newObject);
        const oldElement = filmComponent.element;
        filmComponent.update(updatedFilm);
        filmComponent.render();
        container.replaceChild(filmComponent.element, oldElement);
        body.removeChild(filmDetailComponent.element);
        filmDetailComponent.unrender();
      };
    };
  }
};

/**
 * установка класса Активности на фильтр.
 * @param {object} container - DOM элемент, со списком фильтров.
 * @param {string} filterName - наименование фильтра.
 */
const setActiveFilter = (container, filterName) => {
  const filters = container.querySelectorAll(`.${Selector.NAVIGATION_ITEM}`);
  filters.forEach((it) => {
    it.classList.remove(Selector.NAVIGATION_ITEM_ACTIVE);
    if (it.getAttribute(`href`).split(`#`).pop() === filterName) {
      it.classList.add(Selector.NAVIGATION_ITEM_ACTIVE);
      filterName = it.getAttribute(`href`).split(`#`).pop();
    }
  });
};

/**
 * Инициализация скриптов для сайта.
 *  Запускает функцию отрисовки фильтров;
 *  Запускает функцию установки активного фильтра;
 *  Запускает функцию орисовки карточек задач в разных секциях документа;
 *  Запускает обработкик клика на фильтр.
 */
const init = () => {
  renderFilters(FilmList, filtersContainer);
  setActiveFilter(filtersContainer, activeFilter);

  const allFilms = filterFilms(FilmList);
  renderFilmList(allFilms, filmContainer, true);

  const topRatedFilms = filterFilms(FilmList, `top-rated`);
  renderFilmList(topRatedFilms, topFilmContainer, false);

  const topCommentedFilms = filterFilms(FilmList, `top-commented`);
  renderFilmList(topCommentedFilms, commentedFilmContainer, false);

  const onChangeFilter = (evt) => {
    if (evt.target.classList.contains(Selector.NAVIGATION_ITEM) && evt.target.hasAttribute(`href`)) {
      const filterName = evt.target.getAttribute(`href`).split(`#`).pop();
      const filteredTasks = filterFilms(FilmList, filterName);
      renderFilmList(filteredTasks, filmContainer, true);
      setActiveFilter(filtersContainer, filterName);

      const topCommentedFilmsFiltered = filterFilms(FilmList, `top-commented`);
      renderFilmList(topCommentedFilmsFiltered, commentedFilmContainer, false);
    }
  };

  filtersContainer.addEventListener(`click`, onChangeFilter);
};

init();
