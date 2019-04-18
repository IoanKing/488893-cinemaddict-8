import Selector from "./selectors";
import {Statistics} from "../components/statistics";
import templateChart from "../templates/template-chart";
import {getFilteredData, ERROR_MESSAGE} from "./utils";

/**
 * Рендерит страницу с статистикой пользователя.
 * @param {Object} collection - коллекция с данными.
 * @param {Object} container - элемент DOM
 */
const renderStatistic = (collection, container) => {
  const stat = new Statistics(collection);
  stat.render();
  let statisticContainer = stat.element.querySelector(`.${Selector.STATISTIC_CHART}`);
  container.appendChild(stat.element);
  templateChart(statisticContainer, stat.collection);

  stat.onFilter = (evt) => {
    const filterName = evt.target.value;
    const oldChild = stat.element;
    stat.update = getFilteredData(collection, filterName);
    stat.render();
    statisticContainer = stat.element.querySelector(`.${Selector.STATISTIC_CHART}`);
    stat.element.querySelector(`#statistic-${filterName}`).checked = true;
    container.replaceChild(stat.element, oldChild);
    templateChart(statisticContainer, stat.collection);
  };
};

/**
 * Отрисовывает секцию с количеством фильмов в Футере.
 * @param {number} count - Количество фильмов.
 * @param {object} container - DOM элемент для вставки элемента.
 */
const renderCountFilms = (count, container) => {
  container.innerHTML = ``;
  const filmsCount = count.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1`);
  const filmsCountText = `<p> ${filmsCount} movie inside</p>`;
  container.innerHTML = filmsCountText;
};

/**
 * Отрисовка сообщения об ошибке
 * @param {string} error - сообщение.
 * @param {object} container - DOM елемент.
 */
const renderErrorMessage = (error, container) => {
  container.innerText = `${ERROR_MESSAGE}
  ${error}`;
};

/**
 * Отрисовывает секцию с количеством фильмов в Футере.
 * @param {object} collection - Коллекция фильмов.
 * @param {object} container - DOM элемент для отрисовки.
 */
const renderProfille = (collection, container) => {
  const filmCount = Object.values(collection).reduce((sum, current) => +sum + +current.isWatched, 0);
  let renderText = ``;
  if (filmCount > 1 && filmCount <= 10) {
    renderText = `novice`;
  } else if (filmCount > 10 && filmCount <= 20) {
    renderText = `fan`;
  } else if (filmCount > 20) {
    renderText = `movie buff`;
  }
  container.innerText = renderText;
};

export {renderStatistic, renderCountFilms, renderProfille, renderErrorMessage};
