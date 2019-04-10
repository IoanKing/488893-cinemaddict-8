import moment from "moment";

export default (data) => {
  const genre = data.genres.values().next().value;
  return `
    <article class="film-card ${(data.isControl) ? `` : `film-card--no-controls`}">
    <h3 class="film-card__title">${data.title}</h3>
    <p class="film-card__rating">${data.rating}</p>
    <p class="film-card__info">
      <span class="film-card__realise">${moment(data.realise).format(`YYYY`)}</span>
      <span class="film-card__duration">${(data.duration) >= 60 ? `${Math.floor(data.duration / 60)}h ${data.duration % 60}m` : `${data.duration}m`}</span>
      <span class="film-card__genre">${(genre) ? genre : ``}</span>
    </p>
    <img src="${data.poster}" alt="" class="film-card__poster">
    ${(data.isControl) ? `<p class="film-card__description">${data.description}</p>` : ``}
    <button class="film-card__comments">${data.comments.length} comment${(data.comments.length > 1) ? `s` : ``}</button>

    ${(data.isControl) ? `<form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>` : ``}
  </article>`.trim();
};
