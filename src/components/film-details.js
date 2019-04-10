import Selector from "../modules/selectors";
import Component from "./component";
import {ENTER_KEYCODE} from "../modules/utils";
import templateFilmDetail from "../templates/template-film-details";

const ANIMATION_TIMEOUT = 600;

export default class FilmDetails extends Component {
  constructor(collection) {
    super();
    this._id = collection.id;
    this._title = collection.title;
    this._original = collection.original;
    this._director = collection.director;
    this._writers = collection.writers;
    this._actors = collection.actors;
    this._totalRating = collection.totalRating;
    this._userRating = collection.userRating;
    this._realise = collection.realise;
    this._duration = collection.duration;
    this._genres = collection.genres;
    this._poster = collection.poster;
    this._description = collection.description;
    this._comments = collection.comments;
    this._age = collection.age;
    this._country = collection.country;

    this._isWatched = collection.isWatched;
    this._isFavorites = collection.isFavorites;
    this._isWatchList = collection.isWatchList;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onAddToWatchList = this._onAddToWatchList.bind(this);
    this._onMarkAsWatched = this._onMarkAsWatched.bind(this);
    this._onMarkAsFavorite = this._onMarkAsFavorite.bind(this);
    this._onRatingUpdate = this._onRatingUpdate.bind(this);
    this._onAddComment = this._onAddComment.bind(this);

    this._isCreate = false;
  }

  _onCloseButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onClose === `function`) {
      this._onClose();
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

  _onRatingUpdate(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.${Selector.FORM}`));
    const newData = this._processForm(formData);
    if (typeof this._onRatingChange === `function`) {
      this._userRating = newData.userRating;
      this._onRatingChange(this._userRating);
    }
    this.update(newData);
  }

  _onAddComment(evt) {
    if (evt.keyCode === ENTER_KEYCODE && typeof this._onComment === `function`) {
      const formData = new FormData(this._element.querySelector(`.${Selector.FORM}`));
      const newData = this._processForm(formData);
      this._comments = newData.comments;
      this._onComment(this._comments);
    }
  }

  _processForm(formData) {
    const entry = {
      userRating: ``,
      comments: this._comments,
    };

    const newComment = {};

    for (const pair of formData.entries()) {
      const [argument, value] = pair;
      if (argument === `score`) {
        entry.userRating = value;
      } else if (argument === `comment`) {
        newComment.comment = value;
      } else if (argument === `commentEmoji`) {
        newComment.emotion = value;
      }
    }
    newComment.author = `Unknown`;
    newComment.date = new Date();

    if (newComment.comment.trim() !== ``) {
      entry.comments.push(newComment);
    }

    return entry;
  }

  set onClose(fn) {
    this._onClose = fn;
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

  set onRatingUpdate(fn) {
    this._onRatingChange = fn;
  }

  set onAddComment(fn) {
    this._onComment = fn;
  }

  get element() {
    return this._element;
  }

  get collection() {
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

  shake() {
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
  }

  get formTemplate() {
    return templateFilmDetail(this.collection);
  }

  get template() {
    return `
    <section class="film-details" ${(this._isCreate) ? `style="animation: none;"` : ``}>
    ${this.formTemplate}
    </section>
    `.trim();
  }

  addListener() {
    this._isCreate = true;
    this._element.querySelector(`.${Selector.BTH_CLOSE}`)
      .addEventListener(`click`, this._onCloseButtonClick);
    this._element.querySelector(`#${Selector.WATCHLIST}`)
      .addEventListener(`click`, this._onAddToWatchList);
    this._element.querySelector(`#${Selector.WATCHED}`)
      .addEventListener(`click`, this._onMarkAsWatched);
    this._element.querySelector(`#${Selector.FAVORITE}`)
      .addEventListener(`click`, this._onMarkAsFavorite);
    this._element.querySelector(`.${Selector.COMMENT_INPUT}`)
      .addEventListener(`keypress`, this._onAddComment);
    this._element.querySelectorAll(`.${Selector.RATING_INPUT}`)
      .forEach((it) => {
        it.addEventListener(`click`, this._onRatingUpdate);
      });
  }

  removeListener() {
    this._element.querySelector(`.${Selector.BTH_CLOSE}`)
      .removeEventListener(`click`, this._onCloseButtonClick);
    this._element.querySelector(`#${Selector.WATCHLIST}`)
      .removeEventListener(`click`, this._onAddToWatchList);
    this._element.querySelector(`#${Selector.WATCHED}`)
      .removeEventListener(`click`, this._onMarkAsWatched);
    this._element.querySelector(`#${Selector.FAVORITE}`)
      .removeEventListener(`click`, this._onMarkAsFavorite);
    this._element.querySelector(`.${Selector.COMMENT_INPUT}`)
      .removeEventListener(`keypress`, this._onAddComment);
    this._element.querySelectorAll(`.${Selector.RATING_INPUT}`)
      .forEach((it) => {
        it.removeEventListener(`click`, this._onRatingUpdate);
      });
  }
}