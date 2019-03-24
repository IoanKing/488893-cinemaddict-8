import Filter from "./filter";
import Selector from "./selectors";

export default class FilterList {
  constructor(container) {
    this._container = container;
    this._element = null;
    this._dataCollection = null;

    this._onDataFiltering = this._onDataFiltering.bind(this);
  }

  _onDataFiltering(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains(Selector.NAVIGATION_ITEM) && evt.target.hasAttribute(`href`)) {
      const filter = evt.target.getAttribute(`href`).split(`#`).pop();
      const MAX_MOVIE_COUNT = 10;

      const filterDefault = (collection) => {
        return Object.values(collection).slice(0, Math.min(MAX_MOVIE_COUNT, collection.length));
      };

      const filterFavorites = (collection) => {
        return Object.values(collection).filter((it) => it._isFavorites);
      };

      const filterWathlists = (collection) => {
        return Object.values(collection).filter((it) => it._isWatchList);
      };

      const filterHistoric = (collection) => {
        return Object.values(collection).filter((it) => it._isWatched);
      };

      switch (filter) {
        case `favorites`:
          this._onFilmList.Filter = filterFavorites;
          this._onFilmList.render();
          this.setActiveFilter(`favorites`);
          break;
        case `watchlist`:
          this._onFilmList.Filter = filterWathlists;
          this._onFilmList.render();
          this.setActiveFilter(`watchlist`);
          break;
        case `history`:
          this._onFilmList.Filter = filterHistoric;
          this._onFilmList.render();
          this.setActiveFilter(`history`);
          break;
        default:
          this._onFilmList.Filter = filterDefault;
          this._onFilmList.render();
          this.setActiveFilter(`all`);
          break;
      }
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _getFiltersList() {
    const filters = [];
    const collection = this._makeCollection();
    collection.forEach((element) => {
      filters.push(new Filter(element));
    });
    return filters;
  }

  _makeCollection() {
    const collection = this._onFilmList.collection;
    return [
      {
        title: `Favorites`,
        slug: `favorites`,
        isWatched: false,
        count: Object.values(collection).reduce((sum, current) => +sum + +current._isFavorites, 0),
      },
      {
        title: `History`,
        slug: `history`,
        isWatched: false,
        count: Object.values(collection).reduce((sum, current) => +sum + +current._isWatched, 0),
      },
      {
        title: `Watchlist`,
        slug: `watchlist`,
        isWatched: false,
        count: Object.values(collection).reduce((sum, current) => +sum + +current._isWatchList, 0),
      },
      {
        title: `All movies`,
        slug: `all`,
        isWatched: false,
        count: collection.length,
      },
    ];
  }

  set onFilmList(obj) {
    this._onFilmList = obj;
    this._dataCollection = this._getFiltersList();
  }

  get element() {
    return this._element;
  }

  render(container) {
    this._element = container;
    this._dataCollection.forEach((it) => {
      this._element.insertAdjacentElement(`afterbegin`, it.render());
    });
    this.setActiveFilter(`all`);
    this.addListener();
  }

  unrender() {
    this._container = null;
    this._element = null;
    this._dataCollection = null;
    this.removeListener();
  }

  setActiveFilter(filterName) {
    const filters = this._element.querySelectorAll(`.${Selector.NAVIGATION_ITEM}`);
    filters.forEach((filter) => {
      if (filter.getAttribute(`href`) === `#${filterName}`) {
        filter.classList.add(Selector.NAVIGATION_ITEM_ACTIVE);
      } else {
        filter.classList.remove(Selector.NAVIGATION_ITEM_ACTIVE);
      }
    });
  }

  addListener() {
    this._element.addEventListener(`click`, this._onDataFiltering);
  }

  removeListener() {
    this._element.removeEventListener(`click`, this._onDataFiltering);
  }
}
