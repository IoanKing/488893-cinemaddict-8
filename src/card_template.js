/**
 * Шаблон карточки задачи.
 * @param {object} element Объект с данными для карточки задачи.
 * @param {object} isControls признак наличия контролов.
 * @return {string} разметка HTML блока с карточкой задачи.
 */
export default (element, isControls = false) => `
  <article class="film-card ${(isControls) ? `` : `film-card--no-controls`}">
    <h3 class="film-card__title">${element.title}</h3>
    <p class="film-card__rating">${element.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${element.year}</span>
      <span class="film-card__duration">${element.duration}</span>
      <span class="film-card__genre">${element.genre}</span>
    </p>
    <img src="./images/posters/${element.poster}" alt="" class="film-card__poster">
    ${(isControls) ? `<p class="film-card__description">${element.description}</p>` : ``}
    <button class="film-card__comments">${element.comments.length} comment${(element.comments.length > 1) ? `s` : ``}</button>

    ${(isControls) ? `<form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>` : ``}
  </article>`;
