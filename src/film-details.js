import Selector from "./selectors";
import Component from "./component";
import {Emoji, MAX_RATING} from "./utils";
import moment from "moment";

export default class FilmDetails extends Component {
  constructor(collection) {
    super();
    this._title = collection.title;
    this._original = collection.original;
    this._director = collection.director;
    this._writers = collection.writers;
    this._authors = collection.authors;
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
  }

  _onCloseButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.${Selector.FORM}`));
    const newData = this._processForm(formData);
    if (typeof this._onClose === `function`) {
      this._onClose(newData);
    }
    this.update(newData);
  }

  _processForm(formData) {
    const entry = {
      userRating: ``,
      isWatched: false,
      isFavorites: false,
      isWatchList: false,
      comments: this._comments,
    };

    const filmDetailMapper = FilmDetails.createMapper(entry);
    const newComment = {};

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (filmDetailMapper[property] && property !== `comment` && property !== `commentEmoji`) {
        filmDetailMapper[property](value);
      }
      if (property === `comment`) {
        newComment.text = value;
      }
      if (property === `commentEmoji`) {
        newComment.emoji = value;
      }
    }

    newComment.author = `Unknown`;
    newComment.published = new Date();

    if (newComment.text.trim() !== ``) {
      entry.comments.push(newComment);
    }

    return entry;
  }

  static createMapper(target) {
    return {
      score: (value) => {
        target.userRating = +value;
      },
      watched: (value) => {
        target.isWatched = (value === `on`);
      },
      favorite: (value) => {
        target.isFavorites = (value === `on`);
      },
      watchlist: (value) => {
        target.isWatchList = (value === `on`);
      },
    };
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  get element() {
    return this._element;
  }

  get template() {
    return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${this._poster}" alt="${this._title}">

            <p class="film-details__age">${this._age}</p>
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
                ${(Array.from(this._authors).map((author) => author).join(`, `))}
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
            <span class="film-details__comment-emoji">${Emoji[comment.emoji]}</span>
            <div>
              <p class="film-details__comment-text">${comment.text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${moment(new Date() - comment.published).format(`D`)} days ago</span>
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
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i + 1}" id="rating-${i + 1}" ${ this._userRating === i + 1 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${i + 1}">${i + 1}</label>
                `).trim())).join(``) }
              </div>
            </section>
          </div>
        </section>
      </form>
    </section>
    `.trim();
  }

  addListener() {
    this._element.querySelector(`.${Selector.BTH_CLOSE}`)
      .addEventListener(`click`, this._onCloseButtonClick);
  }

  removeListener() {
    this._element.querySelector(`.${Selector.BTH_CLOSE}`)
      .removeEventListener(`click`, this._onCloseButtonClick);
  }

  update(collection) {
    this._userRating = collection.userRating;
    this._isWatched = collection.isWatched;
    this._isFavorites = collection.isFavorites;
    this._isWatchList = collection.isWatchList;
    this._comments = collection.comments;
  }
}
