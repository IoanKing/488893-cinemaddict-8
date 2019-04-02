import Selector from "./selectors";
import Component from "./component";
import {Emoji, MAX_RATING, ENTER_KEYCODE} from "./utils";
import moment from "moment";

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

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
  }

  get formTemplate() {
    return `
    <form class="film-details__inner" action="" method="get">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${this._poster}" alt="${this._title}">

            <p class="film-details__age">${this._age}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: ${this._original}</p>
              </div>

              <div class="film-details__totalRating">
                <p class="film-details__total-rating">${this._totalRating}</p>
                <p class="film-details__user-rating">Your rate ${this._userRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${(Array.from(this._writers).map((writer) => writer).join(`, `))}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">
                ${(Array.from(this._actors).map((actor) => actor).join(`, `))}
              </td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(this._realise).format(`D MMM YYYY`)} (${this._country})</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${this._duration} min</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                ${(Array.from(this._genres).map((genry) => `<span class="film-details__genre">${genry}</span>`).join(` `))}
                </tr>
            </table>

            <p class="film-details__film-description">
              ${this._description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${(this._isWatchList) ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">${(this._isWatchList) ? `Already in watchlist` : `Add to watchlist`}</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${(this._isWatched) ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">${(this._isWatched) ? `Already watched` : `Add to watched`}</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${(this._isFavorites) ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">${(this._isFavorites) ? `Already in favorites` : `Add to favorites`}</label>
        </section>

        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${(Array.from(this._comments).map((comment) => (`
            <li class="film-details__comment">
            <span class="film-details__comment-emoji">${Emoji[comment.emotion]}</span>
            <div>
              <p class="film-details__comment-text">${comment.comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${moment(new Date() - comment.date).format(`D`)} days ago</span>
              </p>
            </div>
          </li>`.trim())))
          .join(``)}
          </ul>

          <div class="film-details__new-comment">
            <div>
              <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
              <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="commentEmoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

                <input class="film-details__emoji-item visually-hidden" name="commentEmoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

                <input class="film-details__emoji-item visually-hidden" name="commentEmoji" type="radio" id="emoji-grinning" value="grinning">
                <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
              </div>
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
            </label>
          </div>
        </section>

        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
            <button class="film-details__watched-reset" type="button">undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${this._title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
              ${ (new Array(MAX_RATING)
                .fill()
                .map((value, i) => (`
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i + 1}" id="rating-${i + 1}" ${ Math.round(this._userRating) === i + 1 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${i + 1}">${i + 1}</label>
                `).trim())).join(``) }
              </div>
            </section>
          </div>
        </section>
      </form>`.trim();
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
