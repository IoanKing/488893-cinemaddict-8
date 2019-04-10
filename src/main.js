import Film from "./components/film";
import FilmDetail from "./components/film-details";
import Filter from "./components/filter";
import {Statistics} from "./components/statistics";

import tamplateStyle from "./templates/template-animations-style";
import navigationStat from "./templates/template-navigation-stat";

import API from "./modules/api";
import Selector from "./modules/selectors";
import {filterFilms, getFilters, setActiveFilter} from "./modules/filtering";
import {getRandomString, createElement, FiltersName} from "./modules/utils";

const messages = {
  ERROR: `Something went wrong while loading movies. Check your connection or try again later`,
  LOAD: `<h2>Loading movies...</h2>`,
};

const elementDom = {
  FILTERS: document.querySelector(`.${Selector.NAVIGATION}`),
  FILMS: document.querySelector(`.${Selector.CONTAINER}`),
  TOP_RATING: document.querySelector(`#${Selector.TOP_MOVIE}`),
  TOP_COMMENTED: document.querySelector(`#${Selector.COMMENTED_MOVIE}`),
  MAIN: document.querySelector(`${Selector.MAIN}`),
  BODY: document.querySelector(`${Selector.BODY}`),
  FOOTER_STATISTIC: document.querySelector(`${Selector.FOOTER_STATISTIC}`),
  PROFILE_RATING: document.querySelector(`${Selector.PROFILE_RATING}`),
  HEAD: document.querySelector(`${Selector.HEAD}`)
};

const apiSetting = {
  AUTHORIZATION: `Basic ${getRandomString()}`,
  END_POINT: `https://es8-demo-srv.appspot.com/moowle`
};

const api = new API({endPoint: apiSetting.END_POINT, authorization: apiSetting.AUTHORIZATION});
let activeFilter = `all`;

/**
 * Отрисовка фильтров на странице.
 * @param {object} Films - коллекция обьектов.
 * @param {object} container - DOM элемент, в котором будет выполняться
 */
const renderFilters = (Films, container) => {
  container.innerHTML = ``;
  const filters = getFilters(Films);

  for (const filter of filters) {
    const filterComponent = new Filter(filter);

    filterComponent.onFilter = (evt) => {
      const filterName = evt.target.getAttribute(`href`).split(`#`).pop();
      api.getFilms()
      .then((films) => {
        renderFilmList(films, elementDom.FILMS, filterName);
      })
      .catch((error) => {
        elementDom.MAIN.innerText = `${messages.ERROR}
        ${error}`;
      });
      activeFilter = setActiveFilter(elementDom.FILTERS, filterName);
    };

    container.insertAdjacentElement(`afterbegin`, filterComponent.render());
  }

  container.insertAdjacentElement(`beforeend`, createElement(navigationStat()));
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

    if (filter === FiltersName.TOP_RATED || filter === FiltersName.TOP_COMMENTED) {
      filmComponent.isShowDetail = false;
    }

    const renderedFilm = filmComponent.render();

    container.appendChild(renderedFilm);

    const update = (movie) => {
      api.updateFilm({id: movie.id, data: movie.toRAW()})
      .then(() => {
        renderFilters(films, elementDom.FILTERS);
        renderFilmList(films, elementDom.FILMS, filter);
        activeFilter = setActiveFilter(elementDom.FILTERS, filter);
      });
    };

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
        elementDom.BODY.removeChild(popup);
      }
      const filmDetailComponent = new FilmDetail(filmComponent.filmData);
      popup = filmDetailComponent.render();
      elementDom.BODY.appendChild(popup);

      const updateDetail = (movie) => {
        block();
        api.updateFilm({id: movie.id, data: movie.toRAW()})
          .then(() => {
            const replacedElement = filmDetailComponent.element;
            elementDom.BODY.replaceChild(filmDetailComponent.render(), replacedElement);
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
            elementDom.BODY.replaceChild(filmDetailComponent.render(), replacedElement);
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
            elementDom.BODY.replaceChild(filmDetailComponent.render(), replacedElement);
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
        renderFilters(films, elementDom.FILTERS);
        renderFilmList(films, elementDom.FILMS, filter, true);
        activeFilter = setActiveFilter(elementDom.FILTERS, filter);
      };
    };
  }
};

/**
 * Перерисовывает страницу - отображает блок со статистикой.
 * @param {object} evt - событие клика.
 */
const onClickStat = (evt) => {
  const filterName = evt.target.getAttribute(`href`).split(`#`).pop();
  activeFilter = setActiveFilter(elementDom.FILTERS, filterName);

  renderStatistic();

  const filmsContainer = document.querySelector(`.${Selector.FILMS}`);
  filmsContainer.classList.add(Selector.HIDDEN);
};

/**
 * Рендерит страницу с статистикой пользователя.
 */
const renderStatistic = () => {
  api.getFilms()
    .then((films) => {
      const stat = new Statistics(films);
      stat.render();
      const staticticContainer = stat.element.querySelector(`.${Selector.STATISTIC_CHART}`);
      elementDom.MAIN.appendChild(stat.element);
      stat.renderChart(staticticContainer);
    })
    .catch((error) => {
      elementDom.MAIN.innerText = `${messages.ERROR}
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
  elementDom.HEAD.insertAdjacentElement(`beforeend`, createElement(tamplateStyle()));
  elementDom.FILMS.innerHTML = `${messages.LOAD}`;
  api.getFilms()
    .then((films) => {
      renderFilmList(films, elementDom.FILMS, activeFilter);

      renderFilters(films, elementDom.FILTERS);
      activeFilter = setActiveFilter(elementDom.FILTERS, activeFilter);

      renderFilmList(films, elementDom.TOP_RATING, FiltersName.TOP_RATED);

      renderFilmList(films, elementDom.TOP_COMMENTED, FiltersName.TOP_COMMENTED);
    })
    .catch((error) => {
      elementDom.MAIN.innerText = `${messages.ERROR}
      ${error}`;
    });
};

init();
