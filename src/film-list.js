import Film from "./film";
import FilmDetail from "./film-details";
import {mockdata} from "./mock";

export default class FilmList {
  constructor() {
    this._collection = this._getCollection(mockdata);
    this._onFilterData = this._getCollection(mockdata);
    this._popupContainer = null;
  }

  _makeFilm(film) {
    const newFilm = new Film(film);
    newFilm.onClick = () => {
      const filmDetail = new FilmDetail(newFilm);
      filmDetail.container = this._popupContainer;
      filmDetail.onClose = (newObject) => {
        filmDetail.unrender();
      };
      filmDetail.render();
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
    this._element = obj;
  }

  get collection() {
    return this._collection;
  }

  render(container = this._element, isControls = true) {
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
    this.unrender();
    this._onFilterData = collection;
    this.render();
  }

  addListener() {
    this._element.addEventListener(`click`, this._onCommentButtonClick);
  }

  removeListener() {
    this._element.removeEventListener(`click`, this._onCommentButtonClick);
  }
}
