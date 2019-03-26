import Film from "./film";
import FilmDetail from "./film-details";
import {mockdata} from "./mock";

export default class FilmList {
  constructor(container) {
    this._container = container;
    this._collection = this._getCollection(mockdata);
    this._popupContainer = null;
  }

  _makeFilm(film) {
    const newFilm = new Film(film);
    newFilm.render();

    newFilm.onClick = () => {
      const filmDetail = new FilmDetail(film);
      filmDetail.render();
      this._popupContainer.insertAdjacentElement(`beforeend`, filmDetail.element);

      filmDetail.onClose = (newObject) => {
        film.userRating = newObject.userRating;
        film.isWatched = newObject.isWatched;
        film.isFavorites = newObject.isFavorites;
        film.isWatchList = newObject.isWatchList;
        if (newObject.commentText.trim() !== ``) {
          film.comments.push({
            emoji: newObject.commentEmoji,
            author: `Unknown`,
            published: Date.now(),
            text: newObject.commentText,
          });
        }

        newFilm.update(film);
        newFilm.render();
        filmDetail.unrender();
        this.render();
      };
    };
    return newFilm;
  }

  _getCollection(collection) {
    const films = [];
    collection.forEach((element) => {
      films.push(this._makeFilm(element));
    });
    return films;
  }

  set popupContainer(container) {
    this._popupContainer = container;
  }

  set Filter(fn) {
    this._onFilter = fn;
  }

  set defaultContainer(obj) {
    this._container = obj;
  }

  get collection() {
    return this._collection;
  }

  render(container = this._container, isControls = true) {
    container.innerHTML = ``;
    const partOfElements = this._onFilter(this._collection);

    const fragment = document.createDocumentFragment();
    partOfElements.forEach((it) => {
      it.isShowDetail = isControls;
      fragment.appendChild(it.render());
    });
    container.appendChild(fragment);

  }

  addListener() {
    this._element.addEventListener(`click`, this._onCommentButtonClick);
  }

  removeListener() {
    this._element.removeEventListener(`click`, this._onCommentButtonClick);
  }
}
