import Film from "./components/film";
import FilmDetail from "./components/film-details";
import Filter from "./components/filter";
import {Statistics} from "./components/statistics";
import Search from "./components/search";

import tamplateStyle from "./templates/template-animations-style";
import navigationStat from "./templates/template-navigation-stat";
import templateComments from "./templates/template-comment";
import templateChart from "./templates/template-chart";

import API from "./modules/api";
import Selector from "./modules/selectors";
import debounce from "./modules/debounce";
import {filterFilms, getFilters, setActiveFilter} from "./modules/filtering";
import {createElement, FiltersName, getFilteredData} from "./modules/utils";
import moment from "moment";
import settings from "./modules/settings";

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
  SHOW_MORE: document.querySelector(`.${Selector.SHOW_MORE}`),
};

const api = new API({endPoint: settings.END_POINT, authorization: settings.AUTHORIZATION});
const global = {
  activeFilter: null,
  searchElement: null,
  filmsCollection: null,
  filteredCollection: null,
  filmsCount: settings.MOVIE_SHOW_COUNT,
};

/**
 * Очистка текста в поле поиска.
 */
const clearSearch = () => {
  const searchFiled = document.querySelector(`.${Selector.SEARCH_FILED}`);
  if (searchFiled) {
    searchFiled.value = ``;
  }
};

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
        global.filmsCollection = films;
        global.filmsCount = Math.min(films.length, settings.MOVIE_SHOW_COUNT);
        renderShowMoreCollection(films, filterName);
        clearSearch();
      })
      .catch((error) => {
        elementDom.MAIN.innerText = `${messages.ERROR}
        ${error}`;
      });
      global.activeFilter = setActiveFilter(elementDom.FILTERS, filterName);
    };
    container.insertAdjacentElement(`afterbegin`, filterComponent.render());
  }

  container.insertAdjacentElement(`beforeend`, createElement(navigationStat()));
  container.querySelector(`.${Selector.STAT}`).addEventListener(`click`, onClickStat);
};

/**
 * Блокировка полей для комментария и голосования.
 * @param {Object} element - DOM элемент для которгго осуществляется блокировка.
 */
const block = (element) => {
  const containerComment = element.querySelector(`.${Selector.COMMENT_INPUT}`);
  const votingContainers = element.querySelectorAll(`.${Selector.RATING_INPUT}`);
  containerComment.disabled = true;
  votingContainers.forEach((it) => {
    it.disabled = true;
  });
};

/**
 * Разблокировка полей для комментария и голосования.
 * @param {Object} element - DOM элемент для которгго осуществляется разблокировка.
 */
const unblock = (element) => {
  const containerComment = element.querySelector(`.${Selector.COMMENT_INPUT}`);
  const votingContainers = element.querySelectorAll(`.${Selector.RATING_INPUT}`);
  containerComment.disabled = false;
  votingContainers.forEach((it) => {
    it.disabled = false;
  });
};

/**
 * Отправка обновленных данных на сервер, и перерисовка страницы.
 * @param {Object} updateData - Обновленные данные.
 */
const updateCollection = (updateData) => {
  api.updateFilm({id: updateData.id, data: updateData.toRAW()})
  .then(() => {
    refreshPage();
    clearSearch();
  })
  .catch((error) => {
    elementDom.MAIN.innerText = `${messages.ERROR}
    ${error}`;
  });
};

/**
 * Отправка обновленных данных на сервер, и перерисовка страницы.
 * @param {*} collection - Колеекция объектов.
 * @param {*} updateData - Обновленные данные.
 */
const updatePopup = (collection, updateData) => {
  block(collection);
  api.updateFilm({id: updateData.id, data: updateData.toRAW()})
    .then(() => {
      unblock(collection);
    })
    .catch(() => {
      collection.shake();
      unblock(collection);
    });
};

/**
 * Перерисовывает страниц
 */
const refreshPage = () => {
  const searchFiled = document.querySelector(`.${Selector.SEARCH_FILED}`);

  renderFilters(global.filmsCollection, elementDom.FILTERS);
  setActiveFilter(elementDom.FILTERS, global.activeFilter);

  elementDom.FILMS.innerHTML = ``;

  if (searchFiled.value !== ``) {
    renderShowMoreCollection(global.filmsCollection, FiltersName.SEARCH, searchFiled.value);
  } else {
    renderShowMoreCollection(global.filmsCollection, global.activeFilter);
  }
};

/**
 * Создание/открытие popup.
 * @param {Object} data - Данные для формирования popup
 */
const renderPopup = (data) => {
  const oldPopup = elementDom.BODY.querySelector(`.${Selector.POPUP}`);
  if (oldPopup) {
    elementDom.BODY.removeChild(oldPopup);
  }

  const filmDetailComponent = new FilmDetail(data);
  elementDom.BODY.appendChild(filmDetailComponent.render());
  const watchedStatus = filmDetailComponent.element.querySelector(`.${Selector.WATCHED_STATUS}`);

  filmDetailComponent.onAddToWatchList = (bool) => {
    data.isWatchList = bool;
    updatePopup(filmDetailComponent.element, data);
  };

  filmDetailComponent.onMarkAsWatched = (bool) => {
    data.isWatched = bool;
    data.watchedDate = moment();
    if (data.isWatched) {
      watchedStatus.innerText = `already watched`;
      watchedStatus.classList.add(`${Selector.WATCHED_STATUS}--active`);
    } else {
      watchedStatus.innerText = `will watch`;
      watchedStatus.classList.remove(`${Selector.WATCHED_STATUS}--active`);
    }
    updatePopup(filmDetailComponent.element, data);
  };

  filmDetailComponent.onMarkAsFavorite = (bool) => {
    data.isFavorites = bool;
    updatePopup(filmDetailComponent.element, data);
  };

  filmDetailComponent.onRatingUpdate = (newData) => {
    data.userRating = newData;
    block(filmDetailComponent.element);

    const votingFilelds = filmDetailComponent.element.querySelectorAll(`.${Selector.RATING_LABEL}`);
    const userRating = filmDetailComponent.element.querySelector(`.${Selector.USER_RATING}`);
    userRating.innerHTML = ``;

    votingFilelds.forEach((it) => {
      it.style.backgroundColor = `gray`;
    });

    api.updateFilm({id: data.id, data: data.toRAW()})
      .then(() => {
        unblock(filmDetailComponent.element);
        votingFilelds.forEach((it) => {
          it.removeAttribute(`style`);
        });
        userRating.innerHTML = `Your rate ${data.userRating}`;
      })
      .catch(() => {
        filmDetailComponent.shake();
        votingFilelds.forEach((it) => {
          it.style.backgroundColor = `red`;
        });
        unblock(filmDetailComponent.element);
      });
  };

  filmDetailComponent.onChangeComment = (newData) => {
    data.comments = newData;
    block(filmDetailComponent.element);
    const commentField = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_INPUT}`);
    const commentList = filmDetailComponent.element.querySelector(`.${Selector.COMMENTS}`);
    const commentEmoji = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_EMOJI}`);
    commentField.style.border = `solid 1px #979797`;
    commentField.style.padding = `15px 10px`;
    commentField.style.backgroundColor = `gray`;
    api.updateFilm({id: data.id, data: data.toRAW()})
      .then(() => {
        commentList.innerHTML = ``;
        commentList.insertAdjacentHTML(`beforeend`, templateComments(data.comments));
        commentField.removeAttribute(`style`);
        commentField.value = ``;
        commentEmoji.checked = false;
        unblock(filmDetailComponent.element);
      })
      .catch(() => {
        filmDetailComponent.shake();
        commentField.style.border = `solid 6px red`;
        commentField.style.padding = `10px 10px`;
        commentField.style.backgroundColor = `#f6f6f6`;
        unblock(filmDetailComponent.element);
      });
  };

  filmDetailComponent.onClose = () => {
    filmDetailComponent.unrender();
    refreshPage();
  };
};

/**
 * Отрисовка карточек фильмов на странице.
 * @param {object} films - коллекция обьектов для торисовки.
 * @param {object} container - DOM элемент, в котором будет выполняться отрисовка.
 * @param {bool} isShowDetail - признак отрисовки контролов для обьекта.
 */
const renderFilmList = (films, container, isShowDetail = true) => {
  for (const film of films) {
    const filmComponent = new Film(film);
    filmComponent.isShowDetail = isShowDetail;

    const renderedFilm = filmComponent.render();
    container.appendChild(renderedFilm);

    filmComponent.onAddToWatchList = (bool) => {
      film.isWatchList = bool;
      updateCollection(film);
    };

    filmComponent.onMarkAsWatched = (bool) => {
      film.isWatched = bool;
      film.watchedDate = moment();
      updateCollection(film);
    };

    filmComponent.onMarkAsFavorite = (bool) => {
      film.isFavorites = bool;
      updateCollection(film);
    };

    filmComponent.onClick = () => {
      renderPopup(film);
    };
  }
};

/**
 * Перерисовывает страницу - отображает блок со статистикой.
 * @param {object} evt - событие клика.
 */
const onClickStat = (evt) => {
  const filterName = evt.target.getAttribute(`href`).split(`#`).pop();
  global.activeFilter = setActiveFilter(elementDom.FILTERS, filterName);
  renderStatistic();
  const filmsContainer = document.querySelector(`.${Selector.FILMS}`);
  filmsContainer.classList.add(Selector.HIDDEN);
  global.searchElement.value = ``;
};

/**
 * Рендерит страницу с статистикой пользователя.
 */
const renderStatistic = () => {
  api.getFilms()
    .then((films) => {
      global.filmsCollection = films;
      const stat = new Statistics(films);
      stat.render();
      let statisticContainer = stat.element.querySelector(`.${Selector.STATISTIC_CHART}`);
      elementDom.MAIN.appendChild(stat.element);
      templateChart(statisticContainer, stat.collection);

      stat.onFilter = (evt) => {
        const filterName = evt.target.value;
        const oldChild = stat.element;
        stat.update = getFilteredData(films, filterName);
        stat.render();
        statisticContainer = stat.element.querySelector(`.${Selector.STATISTIC_CHART}`);
        stat.element.querySelector(`#statistic-${filterName}`).checked = true;
        elementDom.MAIN.replaceChild(stat.element, oldChild);
        templateChart(statisticContainer, stat.collection);
      };
    })
    .catch((error) => {
      elementDom.MAIN.innerText = `${messages.ERROR}
      ${error}`;
    });
};

/**
 * Обновление списка фильмов - перерисовка.
 * @param {object} collection - коллекция обьектов
 * @param {string} text - Поисковая фраза
 */
const renderSearchResult = (collection, text) => {
  global.filmsCount = settings.MOVIE_SHOW_COUNT;
  renderShowMoreCollection(collection, FiltersName.SEARCH, text);
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
    debounce(renderSearchResult(collection, searchComponent.element.value));
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
 * Отрисовка страницы с ограниченым выводом элементов.
 * @param {object} collection - коллекция обьектов.
 * @param {string} filter - фильтр.
 * @param {string} text - поисковая фраза (необязательно)
 */
const renderShowMoreCollection = (collection, filter, text = ``) => {
  global.filteredCollection = filterFilms(collection, filter, text);
  const slicedCollection = global.filteredCollection.slice(0, global.filmsCount);
  elementDom.FILMS.innerHTML = ``;
  renderFilmList(slicedCollection, elementDom.FILMS);
  elementDom.SHOW_MORE.classList.remove(Selector.HIDDEN);
  elementDom.SHOW_MORE.removeEventListener(`click`, onShowMoreClick);
  elementDom.SHOW_MORE.addEventListener(`click`, onShowMoreClick);

  if (global.filmsCount >= global.filteredCollection.length) {
    elementDom.SHOW_MORE.classList.add(Selector.HIDDEN);
  }
};

const onShowMoreClick = (evt) => {
  evt.preventDefault();
  const moreCollection = global.filteredCollection.slice(global.filmsCount, global.filmsCount + settings.MOVIE_SHOW_COUNT);
  global.filmsCount = global.filmsCount + settings.MOVIE_SHOW_COUNT;

  renderFilmList(moreCollection, elementDom.FILMS);

  if (global.filmsCount >= global.filteredCollection.length) {
    elementDom.SHOW_MORE.classList.add(Selector.HIDDEN);
    elementDom.SHOW_MORE.removeEventListener(`click`, onShowMoreClick);
  }
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
      global.filmsCollection = films;
      renderFilters(films, elementDom.FILTERS);
      global.activeFilter = setActiveFilter(elementDom.FILTERS, FiltersName.ALL);

      global.filmsCount = Math.min(films.length, settings.MOVIE_SHOW_COUNT);
      renderShowMoreCollection(films, global.activeFilter);

      const topRatedFilms = filterFilms(films, FiltersName.TOP_RATED);
      elementDom.TOP_RATING.innerHTML = ``;
      renderFilmList(topRatedFilms, elementDom.TOP_RATING, false);

      const topCommentedFilms = filterFilms(films, FiltersName.TOP_RATED);
      elementDom.TOP_COMMENTED.innerHTML = ``;
      renderFilmList(topCommentedFilms, elementDom.TOP_COMMENTED, false);

      global.searchElement = renderSearch(films);
      renderCountFilms(films.length);
      renderProfille(films);
    })
    .catch((error) => {
      elementDom.MAIN.innerText = `${messages.ERROR}
      ${error}`;
    });
};

init();
