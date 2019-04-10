import Selector from "../modules/selectors";
import Component from "./component";
import templateFilm from "../templates/template-film";

export default class Film extends Component {
  constructor(collection) {
    super();
    this._id = collection.id;
    this._title = collection.title;
    this._original = collection.original;
    this._totalRating = collection.totalRating;
    this._userRating = collection.userRating;
    this._director = collection.director;
    this._writers = collection.writers;
    this._actors = collection.actors;
    this._realise = collection.realise;
    this._duration = collection.duration;
    this._genres = (collection.genres) ? collection.genres : [``];
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
      isControl: true
    };
  }

  _onEditButtonClick(evt) {
    if (evt.target.classList.contains(Selector.BTN_COMMENTS) && typeof this._onClick === `function`) {
      this._onClick(evt);
    }
  }

  _onAddToWatchList(evt) {
    evt.preventDefault();
    if (typeof this._onWatchList === `function`) {
      this._isWatchList = !this._isWatchList;
      this._onWatchList(this._isWatchList);
    }
  }

  _onMarkAsWatched(evt) {
    evt.preventDefault();
    if (typeof this._onWatched === `function`) {
      this._isWatched = !this._isWatched;
      this._onWatched(this._isWatched);
    }
  }

  _onMarkAsFavorite(evt) {
    evt.preventDefault();
    if (typeof this._onFavorite === `function`) {
      this._isFavorites = !this._isFavorites;
      this._onFavorite(this._isFavorites);
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

  set isShowDetail(isControl = true) {
    this._status.isControl = isControl;
  }

  get filmData() {
    return {
      id: this._id,
      title: this._title,
      original: this._original,
      totalRating: this._totalRating,
      userRating: this._userRating,
      director: this._director,
      writers: this._writers,
      actors: this._actors,
      realise: this._realise,
      duration: this._duration,
      genres: this._genres,
      poster: this._poster,
      description: this._description,
      comments: this._comments,
      country: this._country,
      age: this._age,
      isWatched: this._isWatched,
      isFavorites: this._isFavorites,
      isWatchList: this._isWatchList,
    };
  }

  get id() {
    return this._id;
  }

  get collection() {
    return {
      isControl: this._status.isControl,
      title: this._title,
      rating: this._totalRating,
      userRating: this._user,
      realise: this._realise,
      duration: this._duration,
      genres: this._genres,
      poster: this._poster,
      description: this._description,
      comments: this._comments,
    };
  }

  get template() {
    return templateFilm(this.collection);
  }

  addListener() {
    this._element.addEventListener(`click`, this._onEditButtonClick);
    if (this._status.isControl) {
      this._element.querySelector(`.${Selector.CONTROL_WATCHLIST}`)
        .addEventListener(`click`, this._onAddToWatchList);
      this._element.querySelector(`.${Selector.CONTROL_WATCHED}`)
        .addEventListener(`click`, this._onMarkAsWatched);
      this._element.querySelector(`.${Selector.CONTROL_FAVORITE}`)
        .addEventListener(`click`, this._onMarkAsFavorite);
    }
  }

  removeListener() {
    this._element.removeEventListener(`click`, this._onEditButtonClick);
    if (this._status.isControl) {
      this._element.querySelector(`.${Selector.CONTROL_WATCHLIST}`)
        .removeEventListener(`click`, this._onAddToWatchList);
      this._element.querySelector(`.${Selector.CONTROL_WATCHED}`)
        .removeEventListener(`click`, this._onMarkAsWatched);
      this._element.querySelector(`.${Selector.CONTROL_FAVORITE}`)
        .removeEventListener(`click`, this._onMarkAsFavorite);
    }
  }

  update(collection) {
    this._userRating = collection.userRating;
    this._isWatched = collection.isWatched;
    this._isFavorites = collection.isFavorites;
    this._isWatchList = collection.isWatchList;
    this._comments = collection.comments;
  }
}
