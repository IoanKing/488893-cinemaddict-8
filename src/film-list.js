import Film from "./film";
import {mockdata} from "./mock";

export default class FilmList {
  constructor() {
    this._collection = this._getCollection(mockdata);
    this._element = null;
    this._onFilterData = Object.values(this._collection);
  }

  _makeFilm(element) {
    const newFilm = new Film(element);
    return newFilm;
  }

  _getCollection(collection) {
    const Films = [];
    collection.forEach((element) => {
      Films.push(this._makeFilm(element));
    });
    return Films;
  }

  set onClick(fn) {
    this._collection.forEach((element) => {
      element.onClick = fn;
    });
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
