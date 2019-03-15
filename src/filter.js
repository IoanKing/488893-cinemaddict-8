import {createElement} from "./utils";

export default class Filter {
  constructor(collection) {
    this._title = collection.title;
    this._slug = collection.slug;
    this._count = collection.count;
    this._isAdditional = collection.isAdditional;

    this._element = null;
    this._status = {
      isActive: false
    };
  }

  get template() {
    const span = `${(this._isAdditional) ? `` : `<span class="main-navigation__item-count">${this._count}</span>`}`;
    return `
    <a
      href="#${this._slug}"
      class="main-navigation__item ${(this._slug === `all`) ? `main-navigation__item--active` : ``} ${(this._isAdditional) ? `main-navigation__item--additional` : ``}"
      >${this._title} ${(this._slug !== `all`) ? span : ``}</a>
    `.trim();
  }

  render() {
    this._element = this.template;
    return this._element;
  }

  unrender() {
    this._element = null;
  }

}
