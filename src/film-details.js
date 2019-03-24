import {createElement} from "./utils";
import Selector from "./selectors";
import moment from "moment";

export default class FilmDetails {
  constructor(collection) {
    this._title = collection._title;
    this._original = collection._original;
    this._director = collection._director;
    this._writers = collection._writers;
    this._authors = collection._authors;
    this._totalRating = collection._totalRating;
    this._userRating = collection._userRating;
    this._realise = collection._realise;
    this._duration = collection._duration;
    this._genres = collection._genres;
    this._poster = collection._poster;
    this._description = collection._description;
    this._comments = collection._comments;
    this._age = collection._age;
    this._country = collection._country;

    this._isWatched = collection._isWatched;
    this._isFavorites = collection._isFavorites;
    this._isWatchList = collection._isWatchList;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);

    this._container = null;
  }

  _onCloseButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onClose === `function`) {
      this._onClose(this);
    }
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  set container(obj) {
    this._container = obj;
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
            <span class="film-details__comment-emoji">${comment.emoji}</span>
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
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
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
              <img src="images/posters/blackmail.jpg" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">Incredibles 2</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1" ${(this._userRating === 1) ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-1">1</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2" ${(this._userRating === 2) ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-2">2</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3" ${(this._userRating === 3) ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-3">3</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4" ${(this._userRating === 4) ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-4">4</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5" ${(this._userRating === 5) ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-5">5</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6" ${(this._userRating === 6) ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-6">6</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7" ${(this._userRating === 7) ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-7">7</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8" ${(this._userRating === 8) ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-8">8</label>

                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" ${(this._userRating === 9) ? `checked` : ``}>
                <label class="film-details__user-rating-label" for="rating-9">9</label>

              </div>
            </section>
          </div>
        </section>
      </form>
    </section>
    `.trim();
  }

  render() {
    this._element = createElement(this.template);
    this.addListener();
    this._container.insertAdjacentElement(`beforeend`, this._element);
  }

  unrender() {
    this.removeListener();
    this._container.removeChild(this._element);
    this._element = null;
  }

  addListener() {
    this._element.querySelector(`.${Selector.BTH_CLOSE}`)
      .addEventListener(`click`, this._onCloseButtonClick);
  }

  removeListener() {
    this._element.querySelector(`.${Selector.BTH_CLOSE}`)
      .removeEventListener(`click`, this._onCloseButtonClick);
  }

  update() {}
}
