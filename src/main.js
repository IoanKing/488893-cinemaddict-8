import Film from "./components/film";
import Filter from "./components/filter";
import Search from "./components/search";
import FilmDetail from "./components/film-details";

import tamplateStyle from "./templates/template-animations-style";
import navigationStat from "./templates/template-navigation-stat";
import templateComments from "./templates/template-comment";

import API from "./modules/api";
import Settings from "./modules/settings";
import Selector from "./modules/selectors";
import debounce from "./modules/debounce";
import {filterFilms, getFilters, setActiveFilter} from "./modules/filtering";
import {createElement, FiltersName, LOAD_MESSAGE} from "./modules/utils";
import settings from "./modules/settings";
import {
  renderStatistic,
  renderCountFilms,
  renderErrorMessage,
  renderProfille
} from "./modules/render";

import moment from "moment";

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
  filmsCollection: null,
  filteredCollection: null,
  filmsCount: settings.MOVIE_SHOW_COUNT,
};

/**
 * Перерисовывает страницу - отображает блок со статистикой.
 * @param {object} evt - событие клика.
 */
const onClickStat = (evt) => {
  const filterName = evt.target.getAttribute(`href`).split(`#`).pop();
  global.activeFilter = setActiveFilter(elementDom.FILTERS, filterName);
  renderStatistic(global.filmsCollection, elementDom.MAIN);
  const filmsContainer = document.querySelector(`.${Selector.FILMS}`);
  filmsContainer.classList.add(Selector.HIDDEN);
  clearSearch();
};

/**
 * Установка глобальных переменных.
 * @param {object} collection - коллекция фильмов.
 */
const setFilmCollection = (collection) => {
  global.filmsCollection = collection;
  global.filmsCount = Math.min(collection.length, settings.MOVIE_SHOW_COUNT);
  global.filteredCollection = filterFilms(collection, global.activeFilter);
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
      global.activeFilter = setActiveFilter(elementDom.FILTERS, filterName);
      api.getFilms()
      .then((films) => {
        setFilmCollection(films);
        renderShowMoreCollection(global.filteredCollection, global.filmsCount);
      })
      .catch((error) => {
        renderErrorMessage(error, elementDom.MAIN);
      });
    };
    container.insertAdjacentElement(`afterbegin`, filterComponent.render());
  }

  container.insertAdjacentElement(`beforeend`, createElement(navigationStat()));
  container.querySelector(`.${Selector.STAT}`).addEventListener(`click`, onClickStat);
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
    renderErrorMessage(error, elementDom.MAIN);
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
    global.filteredCollection = filterFilms(global.filmsCollection, FiltersName.SEARCH, searchFiled.value);
    renderShowMoreCollection(global.filteredCollection, global.filmsCount);
  } else {
    global.filteredCollection = filterFilms(global.filmsCollection, global.activeFilter);
    renderShowMoreCollection(global.filteredCollection, global.filmsCount);
  }
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
      renderPopup(film, elementDom.BODY);
    };
  }
};

/**
 * Блокировка полей для комментария и голосования.
 * @param {Object} element - DOM элемент для которгго осуществляется блокировка.
 */
const popupEditBlock = (element) => {
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
const popupEditUnblock = (element) => {
  const containerComment = element.querySelector(`.${Selector.COMMENT_INPUT}`);
  const votingContainers = element.querySelectorAll(`.${Selector.RATING_INPUT}`);
  containerComment.disabled = false;
  votingContainers.forEach((it) => {
    it.disabled = false;
  });
};

/**
 * Анимация подрагивания блока.
 * @param {object} container - елемент DOM к которому применяетсяс подрагивание.
 */
const renderShake = (container) => {
  container.style.animation = `shake ${Settings.ANIMATION_SHAKE_TIMEOUT / 1000}s`;
};

/**
 * Функция обновления данных на сервере.
 * @param {object} collection - елемент блокируемый во время обновления.
 * @param {object} updateData - обновляемые данные.
 * @param {function} fnThen - функция выполняемая при успешной загрузке.
 * @param {function} fnCath - функция выполняемая при ошибке.
 */
const updatePopup = (collection, updateData, fnThen = null, fnCath = null) => {
  popupEditBlock(collection);
  api.updateFilm({id: updateData.id, data: updateData.toRAW()})
    .then(() => {
      popupEditUnblock(collection);
      if (typeof fnThen === `function`) {
        fnThen();
      }
    })
    .catch(() => {
      renderShake(collection);
      popupEditUnblock(collection);
      if (typeof fnCath === `function`) {
        fnCath();
      }
    });
};

/**
 * Формирование, отрисовка и взаимодействие с popup.
 * @param {object} data - данные для формирования popup
 * @param {object} container - елемент DOM для отрисовки popup
 */
const renderPopup = (data, container) => {
  const oldPopup = container.querySelector(`.${Selector.POPUP}`);
  if (oldPopup) {
    container.removeChild(oldPopup);
  }

  const filmDetailComponent = new FilmDetail(data);
  container.appendChild(filmDetailComponent.render());
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
    popupEditBlock(filmDetailComponent.element);

    const votingFilelds = filmDetailComponent.element.querySelectorAll(`.${Selector.RATING_LABEL}`);
    const userRating = filmDetailComponent.element.querySelector(`.${Selector.USER_RATING}`);

    userRating.innerHTML = ``;
    votingFilelds.forEach((it) => {
      it.style.backgroundColor = `gray`;
    });

    const renderVoitingRate = () => {
      votingFilelds.forEach((it) => {
        it.removeAttribute(`style`);
      });
      userRating.innerHTML = `Your rate ${data.userRating}`;
    };

    const renderVoitingError = () => {
      votingFilelds.forEach((it) => {
        it.style.backgroundColor = `red`;
      });
    };

    updatePopup(filmDetailComponent.element, data, renderVoitingRate, renderVoitingError);
  };

  filmDetailComponent.onChangeComment = (newData) => {
    data.comments = newData;
    popupEditBlock(filmDetailComponent.element);
    const commentField = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_INPUT}`);
    const commentList = filmDetailComponent.element.querySelector(`.${Selector.COMMENTS}`);
    const commentEmoji = filmDetailComponent.element.querySelector(`.${Selector.COMMENT_EMOJI}`);
    commentField.style.border = `solid 1px #979797`;
    commentField.style.padding = `15px 10px`;
    commentField.style.backgroundColor = `gray`;

    const renderUpdatingComment = () => {
      commentList.innerHTML = ``;
      commentList.insertAdjacentHTML(`beforeend`, templateComments(data.comments));
      commentField.removeAttribute(`style`);
      commentField.value = ``;
      commentEmoji.checked = false;
    };

    const renderUpdatingCommentError = () => {
      commentField.style.border = `solid 6px red`;
      commentField.style.padding = `10px 10px`;
      commentField.style.backgroundColor = `#f6f6f6`;
    };

    updatePopup(filmDetailComponent.element, data, renderUpdatingComment, renderUpdatingCommentError);
  };

  filmDetailComponent.onClose = () => {
    filmDetailComponent.unrender();
    refreshPage();
  };
};

/**
 * Отрисовка и выполнение поиска
 * @param {object} collection - Коллекция обьектов
 * @param {object} container - DOM контейнер для вставики поиска
 * @return {object} - DOM элемент поиска
 */
const renderSearch = (collection, container) => {
  const searchComponent = new Search();
  container.innerHTML = ``;
  container.insertAdjacentElement(`beforeend`, searchComponent.render());
  searchComponent.onChange = () => {
    debounce(renderSearchResult(collection, searchComponent.element.value));
  };
  return searchComponent.element;
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
 * Обновление списка фильмов - перерисовка.
 * @param {object} collection - коллекция обьектов
 * @param {string} text - Поисковая фраза
 */
const renderSearchResult = (collection, text) => {
  global.filmsCount = settings.MOVIE_SHOW_COUNT;
  global.filteredCollection = filterFilms(collection, FiltersName.SEARCH, text);
  renderShowMoreCollection(global.filteredCollection, global.filmsCount);
};

/**
 * Отрисовка страницы с ограниченым выводом элементов.
 * @param {object} collection - коллекция обьектов.
 * @param {number} curentFilmsCount - текущее количество показанных фильмов.
 */
const renderShowMoreCollection = (collection, curentFilmsCount) => {
  const slicedCollection = collection.slice(0, curentFilmsCount);
  elementDom.FILMS.innerHTML = ``;
  renderFilmList(slicedCollection, elementDom.FILMS);
  elementDom.SHOW_MORE.classList.remove(Selector.HIDDEN);
  elementDom.SHOW_MORE.removeEventListener(`click`, onShowMoreClick);
  elementDom.SHOW_MORE.addEventListener(`click`, onShowMoreClick);

  if (curentFilmsCount >= collection.length) {
    elementDom.SHOW_MORE.classList.add(Selector.HIDDEN);
  }
};

/**
 * Дорисовка списка фильмов.
 * @param {object} evt - событие.
 */
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
  elementDom.FILMS.innerHTML = `${LOAD_MESSAGE}`;
  elementDom.PROFILE_RATING.innerHTML = ``;
  api.getFilms()
  .then((films) => {
    setFilmCollection(films);
    renderFilters(films, elementDom.FILTERS);
    global.activeFilter = setActiveFilter(elementDom.FILTERS, FiltersName.ALL);

    renderShowMoreCollection(global.filteredCollection, global.filmsCount);

    const topRatedFilms = filterFilms(films, FiltersName.TOP_RATED);
    elementDom.TOP_RATING.innerHTML = ``;
    renderFilmList(topRatedFilms, elementDom.TOP_RATING, false);

    const topCommentedFilms = filterFilms(films, FiltersName.TOP_RATED);
    elementDom.TOP_COMMENTED.innerHTML = ``;
    renderFilmList(topCommentedFilms, elementDom.TOP_COMMENTED, false);

    renderSearch(films, elementDom.SEARCH);
    renderCountFilms(films.length, elementDom.FOOTER_STATISTIC);
    renderProfille(films, elementDom.PROFILE_RATING);
    renderShowMoreCollection(global.filteredCollection, global.filmsCount);
  })
  .catch((error) => {
    renderErrorMessage(error, elementDom.MAIN);
  });
};

init();
