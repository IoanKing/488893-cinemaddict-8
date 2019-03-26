import Selector from "./selectors";
import Component from "./component";
import moment from "moment";

export default class Film extends Component {
  constructor(collection) {
    super();
    this._title = collection.title;
    this._original = collection.original;
    this._totalRating = collection.totalRating;
    this._userRating = collection.userRating;
    this._director = collection.director;
    this._writers = collection.writers;
    this._authors = collection.authors;
    this._realise = collection.realise;
    this._duration = collection.duration;
    this._genres = collection.genres;
    this._poster = collection.poster;
    this._description = collection.description;
    this._comments = collection.comments;
    this._country = collection.country;
    this._age = collection.age;

    this._isWatched = collection.isWatched;
    this._isFavorites = collection.isFavorites;
    this._isWatchList = collection.isWatchList;

    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._onAddToWatchList = this._onAddToWatchList.bind(this);
    this._onMarkAsWatched = this._onMarkAsWatched.bind(this);
    this._onMarkAsFavorite = this._onMarkAsFavorite.bind(this);
    this._status = {
      isControl: false
    };
  }

  _onEditButtonClick(evt) {
    if (evt.target.classList.contains(Selector.BTN_COMMENTS) && typeof this._onClick === `function`) {
      this._onClick(evt);
    }
  }

  _onAddToWatchList(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains(Selector.CONTROL_WATCHLIST) && typeof this._onWatchList === `function`) {
      const newData = {
        isWatchList: !this._isWatchList
      };
      this._onWatchList(newData);
      this.update(newData);
    }
  }

  _onMarkAsWatched(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains(Selector.CONTROL_WATCHED) && typeof this._onWatched === `function`) {
      const newData = {
        isWatched: !this._isWatched
      };
      this._onWatched(newData);
      this.update(newData);
    }
  }

  _onMarkAsFavorite(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains(Selector.CONTROL_FAVORITE) && typeof this._onFavorite === `function`) {
      const newData = {
        isFavorites: !this._isFavorites
      };
      this._onFavorite(newData);
      this.update(newData);
    }
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  set onAddToWatchList(fn) {
    this._onWatchList = fn;
  }

  set onMarkAsWatched(fn) {
    this._onWatched = fn;
  }

  set onMarkAsFavorite(fn) {
    this._onFavorite = fn;
  }

  get template() {
    return `
    <article class="film-card ${(this._status.isControl) ? `` : `film-card--no-controls`}">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._totalRating} (${this._userRating})</p>
    <p class="film-card__info">
      <span class="film-card__realise">${moment(this._realise).format(`YYYY`)}</span>
      <span class="film-card__duration">${(this._duration) >= 60 ? `${Math.floor(this._duration / 60)}h ${this._duration % 60}m` : `${this._duration}m`}</span>
      <span class="film-card__genre">${this._genres.values().next().value}</span>
    </p>
    <img src="${this._poster}" alt="" class="film-card__poster">
    ${(this._status.isControl) ? `<p class="film-card__description">${this._description}</p>` : ``}
    <button class="film-card__comments">${this._comments.length} comment${(this._comments.length > 1) ? `s` : ``}</button>

    ${(this._status.isControl) ? `<form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>` : ``}
  </article>`.trim();
  }

  set isShowDetail(isControl = true) {
    this._status.isControl = isControl;
  }

  addListener() {
    this._element.addEventListener(`click`, this._onEditButtonClick);
    this._element.addEventListener(`click`, this._onAddToWatchList);
    this._element.addEventListener(`click`, this._onMarkAsWatched);
    this._element.addEventListener(`click`, this._onMarkAsFavorite);
  }

  removeListener() {
    this._element.removeEventListener(`click`, this._onEditButtonClick);
    this._element.removeEventListener(`click`, this._onAddToWatchList);
    this._element.removeEventListener(`click`, this._onMarkAsWatched);
    this._element.removeEventListener(`click`, this._onMarkAsFavorite);
  }

  update(collection) {
    this._userRating = collection.userRating;
    this._isWatched = collection.isWatched;
    this._isFavorites = collection.isFavorites;
    this._isWatchList = collection.isWatchList;
    this._comments = collection.comments;
  }
}
