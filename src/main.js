import Selector from "./selectors";
import Film from "./film";
import FilmDetail from "./film-details";
import Filter from "./filter";
import {Statistics} from "./statistics";
import {
  DEFAULT_EXTRA_COUNT,
  MAX_MOVIE_COUNT,
  getRandomString,
  createElement
} from "./utils";
import API from "./api";

const AUTHORIZATION = `Basic ${getRandomString()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const STAT_TEMPLATE = `<a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>`;
const ERROR_MESSAGE = `Something went wrong while loading movies. Check your connection or try again later`;
const LOAD_MESSAGE = `<h2>Loading movies...</h2>`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const filtersContainer = document.querySelector(`.${Selector.NAVIGATION}`);
const filmContainer = document.querySelector(`.${Selector.CONTAINER}`);
const topFilmContainer = document.querySelector(`#${Selector.TOP_MOVIE}`);
const commentedFilmContainer = document.querySelector(`#${Selector.COMMENTED_MOVIE}`);
const bodyContainer = document.querySelector(`${Selector.BODY}`);
const mainContainer = document.querySelector(`${Selector.MAIN}`);
let activeFilter = `all`;

const newStyle = `<style type="text/css">
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
.shake {
  animation: shake 0.6s;
}
</style>`;

document.querySelector(`head`).insertAdjacentElement(`beforeend`, createElement(newStyle));

/**
 * Фильтрация коллекции обьектов.
 * @param {object} films - коллекция обьектов.
 * @param {string} filterName - наименование фильтра.
 * @param {bool} isLimited - Ограничение на количество элементов.
 * @return {object} - отфильтрованная коллекция.
 */
const filterFilms = (films, filterName) => {
  let data = {};
  switch (filterName) {
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
  return data.slice(0, Math.min(MAX_MOVIE_COUNT, data.length));
};

/**
 * Отрисовка фильтров на странице.
 * @param {object} Films - коллекция обьектов.
 * @param {object} container - DOM элемент, в котором будет выполняться
 */
const renderFilters = (Films, container) => {
  container.innerHTML = ``;
  const filters = [
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

  for (const filter of filters) {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.getAttribute(`href`).split(`#`).pop();
      api.getFilms()
      .then((films) => {
        renderFilmList(films, filmContainer, filterName);
      })
      .catch((error) => {
        mainContainer.innerText = `${ERROR_MESSAGE}
        ${error}`;
      });
      setActiveFilter(filtersContainer, filterName);
    };

    container.insertAdjacentElement(`afterbegin`, filterComponent.render());
  }

  container.insertAdjacentElement(`beforeend`, createElement(STAT_TEMPLATE));
  container.querySelector(`.${Selector.STAT}`).addEventListener(`click`, onClickStat);
};

/**
 * Отрисовка карточек фильмов на странице.
 * @param {object} films - коллекция обьектов для торисовки.
 * @param {object} container - DOM элемент, в котором будет выполняться отрисовка.
 * @param {bool} filter - текущий фильтр.
 * @param {bool} isControl - признак отрисовки контролов для обьекта.
 */
const renderFilmList = (films, container, filter = `all`) => {
  container.innerHTML = ``;
  const filteredFilms = filterFilms(films, filter);

  for (const film of filteredFilms) {

    const filmComponent = new Film(film);
    let popup = null;

    const update = (movie) => {
      api.updateFilm({id: movie.id, data: movie.toRAW()})
      .then(() => {
        renderFilters(films, filtersContainer);
        renderFilmList(films, filmContainer, filter);
        setActiveFilter(filtersContainer, filter);
      });
    };

    container.appendChild(filmComponent.render());

    filmComponent.onAddToWatchList = (bool) => {
      film.isWatchList = bool;
      update(film);
    };

    filmComponent.onMarkAsWatched = (bool) => {
      film.isWatched = bool;
      update(film);
    };

    filmComponent.onMarkAsFavorite = (bool) => {
      film.isFavorites = bool;
      update(film);
    };

    filmComponent.onClick = () => {
      if (popup) {
        bodyContainer.removeChild(popup);
      }
      const filmDetailComponent = new FilmDetail(filmComponent.filmData);
      popup = filmDetailComponent.render();
      bodyContainer.appendChild(popup);

      const updateDetail = (movie) => {
        block();
        api.updateFilm({id: movie.id, data: movie.toRAW()})
          .then(() => {
            const replacedElement = filmDetailComponent.element;
            bodyContainer.replaceChild(filmDetailComponent.render(), replacedElement);
          })
          .catch(() => {
            filmDetailComponent.shake();
            unblock();
          });
      };

      const block = () => {
        const containerComment = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_INPUT}`);
        const votingContainers = filmDetailComponent.element.querySelectorAll(`.${Selector.RATING_INPUT}`);
        containerComment.setAttribute(`disabled`, `disabled`);
        votingContainers.forEach((it) => {
          it.setAttribute(`disabled`, `disabled`);
        });
      };

      const unblock = () => {
        const containerComment = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_INPUT}`);
        const votingContainers = filmDetailComponent.element.querySelectorAll(`.${Selector.RATING_INPUT}`);
        containerComment.removeAttribute(`disabled`);
        votingContainers.forEach((it) => {
          it.removeAttribute(`disabled`);
        });
      };

      filmDetailComponent.onAddToWatchList = (bool) => {
        film.isWatchList = bool;
        updateDetail(film);
      };

      filmDetailComponent.onMarkAsWatched = (bool) => {
        film.isWatched = bool;
        updateDetail(film);
      };

      filmDetailComponent.onMarkAsFavorite = (bool) => {
        film.isFavorites = bool;
        updateDetail(film);
      };

      filmDetailComponent.onRatingUpdate = (newData) => {
        film.userRating = newData;
        block();
        const votingFilelds = filmDetailComponent.element.querySelectorAll(`.${Selector.RATING_LABEL}`);
        votingFilelds.forEach((it) => {
          it.style.backgroundColor = `gray`;
        });
        api.updateFilm({id: film.id, data: film.toRAW()})
          .then(() => {
            unblock();
            const replacedElement = filmDetailComponent.element;
            bodyContainer.replaceChild(filmDetailComponent.render(), replacedElement);
          })
          .catch(() => {
            filmDetailComponent.shake();
            votingFilelds.forEach((it) => {
              it.style.backgroundColor = `red`;
            });
            unblock();
          });
      };

      filmDetailComponent.onAddComment = (newData) => {
        film.comments = newData;
        block();
        const commentField = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_INPUT}`);
        commentField.style.border = `solid 1px #979797`;
        commentField.style.padding = `15px 10px`;
        api.updateFilm({id: film.id, data: film.toRAW()})
          .then(() => {
            unblock();
            const replacedElement = filmDetailComponent.element;
            bodyContainer.replaceChild(filmDetailComponent.render(), replacedElement);
          })
          .catch(() => {
            filmDetailComponent.shake();
            commentField.style.border = `solid 6px red`;
            commentField.style.padding = `10px 10px`;
            unblock();
          });
      };

      filmDetailComponent.onClose = () => {
        filmDetailComponent.unrender();
        renderFilters(films, filtersContainer);
        renderFilmList(films, filmContainer, filter, true);
        setActiveFilter(filtersContainer, filter);
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
};

/**
 * Перерисовывает страницу - отображает блок со статистикой.
 * @param {object} evt - событие клика.
 */
const onClickStat = (evt) => {
  const filterName = evt.target.getAttribute(`href`).split(`#`).pop();
  setActiveFilter(filtersContainer, filterName);

  renderStatistic();

  const filmsContainer = document.querySelector(`.${Selector.FILMS}`);
  filmsContainer.classList.add(Selector.HIDDEN);
};

const renderStatistic = () => {
  api.getFilms()
    .then((films) => {
      const stat = new Statistics(films);
      stat.render();
      const staticticContainer = stat.element.querySelector(`.${Selector.STATISTIC_CHART}`);
      mainContainer.appendChild(stat.element);
      stat.renderChart(staticticContainer);
    })
    .catch((error) => {
      mainContainer.innerText = `${ERROR_MESSAGE}
      ${error}`;
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
  filmContainer.innerHTML = `${LOAD_MESSAGE}`;
  api.getFilms()
    .then((films) => {
      renderFilmList(films, filmContainer, activeFilter);

      renderFilters(films, filtersContainer);
      setActiveFilter(filtersContainer, activeFilter);

      renderFilmList(films, topFilmContainer, `top-rated`);

      renderFilmList(films, commentedFilmContainer, `top-commented`);
    })
    .catch((error) => {
      mainContainer.innerText = `${ERROR_MESSAGE}
      ${error}`;
    });
};

init();
