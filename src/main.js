import Film from "./components/film";
import FilmDetail from "./components/film-details";
import Filter from "./components/filter";
import {Statistics} from "./components/statistics";
import Search from "./components/search";

import Settings from "./modules/settings";

import tamplateStyle from "./templates/template-animations-style";
import navigationStat from "./templates/template-navigation-stat";
import templateComments from "./templates/template-comment";

import API from "./modules/api";
import Selector from "./modules/selectors";
import debounce from "./modules/debounce";
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
  FOOTER_STATISTIC: document.querySelector(`.${Selector.FOOTER_STATISTIC}`),
  PROFILE_RATING: document.querySelector(`.${Selector.PROFILE_RATING}`),
  HEAD: document.querySelector(`${Selector.HEAD}`),
  SEARCH: document.querySelector(`.${Selector.SEARCH}`),
};

const apiSetting = {
  AUTHORIZATION: `Basic ${getRandomString()}`,
  END_POINT: `https://es8-demo-srv.appspot.com/moowle`
};

const api = new API({endPoint: apiSetting.END_POINT, authorization: apiSetting.AUTHORIZATION});
let currentShowCount = Settings.MOVIE_SHOW_COUNT;
let activeFilter = `all`;
let searchElement = null;

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
 * @param {string} searchPrase - поисковая фраза
 * @param {bool} isControl - признак отрисовки контролов для обьекта.
 */
const renderFilmList = (films, container, filter = `all`, searchPrase = ``) => {
  container.innerHTML = ``;
  const filteredFilms = filterFilms(films, filter, searchPrase);

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
            unblock();
          })
          .catch(() => {
            filmDetailComponent.shake();
            unblock();
          });
      };

      const block = () => {
        const containerComment = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_INPUT}`);
        const votingContainers = filmDetailComponent.element.querySelectorAll(`.${Selector.RATING_INPUT}`);
        containerComment.disabled = true;
        votingContainers.forEach((it) => {
          it.disabled = true;
        });
      };

      const unblock = () => {
        const containerComment = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_INPUT}`);
        const votingContainers = filmDetailComponent.element.querySelectorAll(`.${Selector.RATING_INPUT}`);
        containerComment.disabled = false;
        votingContainers.forEach((it) => {
          it.disabled = false;
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
        const votingFilelds = filmDetailComponent.element.querySelectorAll(`.${Selector.RATING_LABEL}`);
        const userRating = filmDetailComponent.element.querySelector(`.${Selector.USER_RATING}`);
        block();
        userRating.innerHTML = ``;
        votingFilelds.forEach((it) => {
          it.style.backgroundColor = `gray`;
        });
        api.updateFilm({id: film.id, data: film.toRAW()})
          .then(() => {
            unblock();
            votingFilelds.forEach((it) => {
              it.removeAttribute(`style`);
            });
            userRating.innerHTML = `Your rate ${film.userRating}`;
          })
          .catch(() => {
            filmDetailComponent.shake();
            votingFilelds.forEach((it) => {
              it.style.backgroundColor = `red`;
            });
            unblock();
          });
      };

      filmDetailComponent.onChangeComment = (newData) => {
        film.comments = newData;
        block();
        const commentField = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_INPUT}`);
        const commentList = filmDetailComponent.element.querySelector(`.${Selector.COMMENTS}`);
        const commentEmoji = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_EMOJI}`);
        commentField.style.border = `solid 1px #979797`;
        commentField.style.padding = `15px 10px`;
        commentField.style.backgroundColor = `gray`;
        api.updateFilm({id: film.id, data: film.toRAW()})
          .then(() => {
            commentList.innerHTML = ``;
            commentList.insertAdjacentHTML(`beforeend`, templateComments(film.comments));
            commentField.removeAttribute(`style`);
            commentField.value = ``;
            commentEmoji.checked = false;
            unblock();
          })
          .catch(() => {
            filmDetailComponent.shake();
            commentField.style.border = `solid 6px red`;
            commentField.style.padding = `10px 10px`;
            commentField.style.backgroundColor = `#f6f6f6`;
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

  searchElement.value = ``;
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
 * Отрисовка и выполнение поиска
 * @param {*} collection - Коллекция обьектов
 * @return {object} - DOM элемент поиска
 */
const renderSearch = (collection) => {
  const searchComponent = new Search();
  elementDom.SEARCH.innerHTML = ``;
  elementDom.SEARCH.insertAdjacentElement(`beforeend`, searchComponent.render());

  searchComponent.onChange = () => {
    debounce(renderFilmList(collection, elementDom.FILMS, FiltersName.SEARCH, searchComponent.element.value));
  };

  return searchComponent.element;
};

/**
 * Отрисовывает секцию с количеством фильмов в Футере.
 * @param {*} count - Количество фильмов
 */
const renderCountFilms = (count) => {
  elementDom.FOOTER_STATISTIC.innerHTML = ``;
  const filmsCount = count.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1`);
  const filmsCountText = `<p> ${filmsCount} movie inside</p>`;
  elementDom.FOOTER_STATISTIC.innerHTML = filmsCountText;
};

/**
 * Отрисовывает секцию с количеством фильмов в Футере.
 * @param {*} collection - Коллекция фильмов.
 */
const renderProfille = (collection) => {
  const filmCount = Object.values(collection).reduce((sum, current) => +sum + +current.isWatched, 0);
  let renderText = ``;
  if (filmCount > 1 && filmCount <= 10) {
    renderText = `novice`;
  } else if (filmCount > 10 && filmCount <= 20) {
    renderText = `fan`;
  } else if (filmCount > 20) {
    renderText = `movie buff`;
  }
  elementDom.PROFILE_RATING.innerHTML = renderText;
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
  elementDom.PROFILE_RATING.innerHTML = ``;
  api.getFilms()
    .then((films) => {
      renderFilmList(films, elementDom.FILMS, activeFilter);

      renderFilters(films, elementDom.FILTERS);
      activeFilter = setActiveFilter(elementDom.FILTERS, activeFilter);

      renderFilmList(films, elementDom.TOP_RATING, FiltersName.TOP_RATED);

      renderFilmList(films, elementDom.TOP_COMMENTED, FiltersName.TOP_COMMENTED);

      searchElement = renderSearch(films);

      renderCountFilms(films.length);
      renderProfille(films);
    })
    .catch((error) => {
      elementDom.MAIN.innerText = `${messages.ERROR}
      ${error}`;
    });
};

init();
