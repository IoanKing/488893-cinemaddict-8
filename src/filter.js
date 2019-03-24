import Component from "./component";

export default class Filter extends Component {
  constructor(collection) {
    super();
    this._title = collection.title;
    this._slug = collection.slug;
    this._count = collection.count;
    this._isWatched = collection.isWatched;

    this._element = null;
  }

  get template() {
    const span = `${(this._isWatched) ? `` : `<span class="main-navigation__item-count">${this._count}</span>`}`;
    return `<a
      ${(this._count !== 0) ? `href="#${this._slug}"` : ``}
      class="main-navigation__item ${(this._isWatched) ? `main-navigation__item--additional` : ``}"
      >${this._title} ${(this._slug !== `all`) ? span : ``}</a>`
      .trim();
  }
}
