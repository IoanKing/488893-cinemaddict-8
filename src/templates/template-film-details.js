import moment from "moment";
import {Emoji, MAX_RATING} from "../modules/utils";

export default (data) => {

  return `
    <form class="film-details__inner" action="" method="get">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${data.poster}" alt="${data.title}">

            <p class="film-details__age">${data.age}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${data.title}</h3>
                <p class="film-details__title-original">Original: ${data.original}</p>
              </div>

              <div class="film-details__totalRating">
                <p class="film-details__total-rating">${data.totalRating}</p>
                <p class="film-details__user-rating">Your rate ${data.userRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${data.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${(Array.from(data.writers).map((writer) => writer).join(`, `))}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">
                ${(Array.from(data.actors).map((actor) => actor).join(`, `))}
              </td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${moment(data.realise).format(`D MMM YYYY`)} (${data.country})</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${data.duration} min</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${data.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                ${(Array.from(data.genres).map((genry) => `<span class="film-details__genre">${genry}</span>`).join(` `))}
                </tr>
            </table>

            <p class="film-details__film-description">
              ${data.description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${(data.isWatchList) ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">${(data.isWatchList) ? `Already in watchlist` : `Add to watchlist`}</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${(data.isWatched) ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">${(data.isWatched) ? `Already watched` : `Add to watched`}</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${(data.isFavorites) ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">${(data.isFavorites) ? `Already in favorites` : `Add to favorites`}</label>
        </section>

        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${(Array.from(data.comments).map((comment) => (`
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
              <img src="${data.poster}" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${data.title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
              ${ (new Array(MAX_RATING)
                .fill()
                .map((value, i) => (`
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i + 1}" id="rating-${i + 1}" ${ Math.round(data._userRating) === i + 1 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${i + 1}">${i + 1}</label>
                `).trim())).join(``) }
              </div>
            </section>
          </div>
        </section>
      </form>`.trim();
};
