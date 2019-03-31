import Selector from "./selectors";
import mockdata from "./mock";
import Film from "./film";
import FilmDetail from "./film-details";
import Filter from "./filter";
import {Statictics} from "./statistics";
import {DEFAULT_EXTRA_COUNT, MAX_MOVIE_COUNT, getRandomString} from "./utils";
import API from "./api";
import {
  onSendData,
  onLoadData,
  onConnectionError,
  successMessage,
  errorMessage
} from "./backend";

const AUTHORIZATION = `Basic ${getRandomString()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;

const FilmList = mockdata;

const filtersContainer = document.querySelector(`.${Selector.NAVIGATION}`);
const filmContainer = document.querySelector(`.${Selector.CONTAINER}`);
const topFilmContainer = document.querySelector(`#${Selector.TOP_MOVIE}`);
const commentedFilmContainer = document.querySelector(`#${Selector.COMMENTED_MOVIE}`);
const bodyContainer = document.querySelector(`${Selector.BODY}`);
const mainContainer = document.querySelector(`${Selector.MAIN}`);
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
 * @param {bool} isLimited - Ограничение на количество элементов.
 * @return {object} - отфильтрованная коллекция.
 */
const filterFilms = (films, filtername, isLimited = true) => {
  let data = {};
  switch (filtername) {
    case `favorites`:
      data = Object.values(films).filter((it) => it.isFavorites);
      break;
    case `watchlist`:
      data = Object.values(films).filter((it) => it.isWatchList);
      break;
    case `history`:
      data = Object.values(films).filter((it) => it.isWatched);
      break;
    case `all`:
      data = Object.values(films);
      break;
    case `top-rated`:
      data = Object.values(films).sort((a, b) => b.totalRating - a.totalRating).slice(0, DEFAULT_EXTRA_COUNT);
      break;
    case `top-commented`:
      data = Object.values(films).sort((a, b) => b.comments.length - a.comments.length).slice(0, DEFAULT_EXTRA_COUNT);
      break;
    default:
      data = Object.values(films);
      break;
  }
  return (isLimited) ? data.slice(0, Math.min(MAX_MOVIE_COUNT, data.length)) : data;
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

    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.getAttribute(`href`).split(`#`).pop();
      const filteredFilms = filterFilms(FilmList, filterName);
      renderFilmList(filteredFilms, filmContainer, true);
      setActiveFilter(filtersContainer, filterName);
    };

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
      bodyContainer.insertAdjacentElement(`beforeend`, filmDetailComponent.render());

      filmDetailComponent.onClose = (newObject) => {
        const updatedFilm = updateFilm(Films, film, newObject);
        const oldElement = filmComponent.element;
        filmComponent.update(updatedFilm);
        filmComponent.render();
        container.replaceChild(filmComponent.element, oldElement);
        bodyContainer.removeChild(filmDetailComponent.element);
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
    const currentFilte = it.getAttribute(`href`).split(`#`).pop();
    it.classList.remove(Selector.NAVIGATION_ITEM_ACTIVE);
    if (currentFilte === filterName) {
      it.classList.add(Selector.NAVIGATION_ITEM_ACTIVE);
      filterName = it.getAttribute(`href`).split(`#`).pop();
      const filmsContainer = document.querySelector(`.${Selector.FILMS}`);
      const statisticContainer = document.querySelector(`.${Selector.STATISTIC}`);
      filmsContainer.classList.remove(Selector.HIDDEN);
      statisticContainer.classList.add(Selector.HIDDEN);
    }
  });
};

/**
 * Перерисовывает страницу - отображает блок со статистикой.
 * @param {object} evt - событие клика.
 */
const onClickStat = (evt) => {
  const filterName = evt.target.getAttribute(`href`).split(`#`).pop();
  setActiveFilter(filtersContainer, filterName, false);
  const filmsContainer = document.querySelector(`.${Selector.FILMS}`);
  const statisticContainer = document.querySelector(`.${Selector.STATISTIC}`);
  filmsContainer.classList.add(Selector.HIDDEN);
  statisticContainer.classList.remove(Selector.HIDDEN);
};

/**
 * Инициализация скриптов для сайта.
 *  Запускает функцию отрисовки фильтров;
 *  Запускает функцию установки активного фильтра;
 *  Запускает функцию орисовки карточек задач в разных секциях документа;
 *  Запускает обработкик клика на фильтр.
 */
const init = () => {
  const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

  api.getFilms()
  .then((films) => {
    console.log(films);
    // renderFilmList(films);
  });

  // const onSuccessLoadData = (data) => {
  //   console.log(data);
  // };

  // onLoadData(onSuccessLoadData, onConnectionError);

  const allFilms = filterFilms(FilmList);
  renderFilmList(allFilms, filmContainer, true);

  const watchedFilms = filterFilms(FilmList, `history`, false);
  const stat = new Statictics(watchedFilms);
  stat.render();
  const staticticContainer = stat.element.querySelector(`.${Selector.STATISTIC_CHART}`);
  stat.element.classList.add(Selector.HIDDEN);
  mainContainer.appendChild(stat.element);
  stat.renderChart(staticticContainer);

  renderFilters(FilmList, filtersContainer);
  setActiveFilter(filtersContainer, activeFilter);

  const topRatedFilms = filterFilms(FilmList, `top-rated`);
  renderFilmList(topRatedFilms, topFilmContainer, false);

  const topCommentedFilms = filterFilms(FilmList, `top-commented`);
  renderFilmList(topCommentedFilms, commentedFilmContainer, false);

  filtersContainer.querySelector(`.${Selector.STAT}`).addEventListener(`click`, onClickStat);
};

init();
