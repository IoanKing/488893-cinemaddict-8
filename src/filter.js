import Component from "./component";

export default class Filter extends Component {
  constructor(collection) {
    super();
    this._title = collection.title;
    this._slug = collection.slug;
    this._count = collection.count;
    this._isWatched = collection.isWatched;

    this._element = null;
    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  _onFilterClick(evt) {
    evt.preventDefault();
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    const span = `${(this._isWatched) ? `` : `<span class="main-navigation__item-count">${this._count}</span>`}`;
    return `<a
      ${(this._count !== 0) ? `href="#${this._slug}"` : ``}
      class="main-navigation__item ${(this._isWatched) ? `main-navigation__item--additional` : ``}"
      >${this._title} ${(this._slug !== `all`) ? span : ``}</a>`
      .trim();
  }

  addListener() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  removeListener() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }

  update(newCount) {
    this._count = newCount;
  }
}
