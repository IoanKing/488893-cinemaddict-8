import Film from "./film";
import FilmDetail from "./film-details";
import {mockdata} from "./mock";

export default class FilmList {
  constructor(container) {
    this._container = container;
    this._collection = this._getCollection(mockdata);
    this._onFilterData = Object.values(this._collection);
    this._popupContainer = null;
  }

  _makeFilm(film) {
    const newFilm = new Film(film);
    newFilm.render();
    const copyNode = Object.assign({}, newFilm);

    newFilm.onClick = () => {
      const filmDetail = new FilmDetail(film);
      filmDetail.render();
      this._popupContainer.insertAdjacentElement(`beforeend`, filmDetail.element);

      filmDetail.onClose = (newObject) => {
        film.userRating = newObject.userRating;
        newFilm.update(film);
        newFilm.render();
        console.log(copyNode);
        console.log(copyNode._element);
        console.log(newFilm._element);
        console.log(newFilm._element === copyNode._element);
        // this._container.replaceChild(newFilm._element, copyNode._element);
        filmDetail.unrender();
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
    const partOfElements = this._onFilter(this._onFilterData);

    const fragment = document.createDocumentFragment();
    partOfElements.forEach((it) => {
      it.isShowDetail = isControls;
      fragment.appendChild(it.render());
    });
    container.appendChild(fragment);

  }

  unrender() {
    this._onFilterData = Object.values(this._collection);
  }

  update(collection) {
    // this.unrender();
    // this._onFilterData = collection;
    // this.render();
  }

  addListener() {
    this._element.addEventListener(`click`, this._onCommentButtonClick);
  }

  removeListener() {
    this._element.removeEventListener(`click`, this._onCommentButtonClick);
  }
}
