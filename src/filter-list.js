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
    if (evt.target.classList.contains(Selector.NAVIGATION_ITEM)) {
      const filter = evt.target.getAttribute(`href`).split(`#`).pop();
      const MAX_MOVIE_COUNT = 10;

      const filterDefault = (collection) => {
        return Object.values(collection).slice(0, Math.min(MAX_MOVIE_COUNT, collection.length));
      };

      const filterFavorites = (collection) => {
        return Object.values(collection).filter((it) => it._isFavorite);
      };

      const filterWathlists = (collection) => {
        return Object.values(collection).filter((it) => it._isWatchList);
      };

      const filterHistoric = (collection) => {
        return Object.values(collection).filter((it) => it._year <= 1970);
      };

      switch (filter) {
        case `favorites`:
          this._onFilmList.Filter = filterFavorites;
          this._onFilmList.render();
          break;
        case `watchlist`:
          this._onFilmList.Filter = filterWathlists;
          this._onFilmList.render();
          break;
        case `history`:
          this._onFilmList.Filter = filterHistoric;
          this._onFilmList.render();
          break;
        default:
          this._onFilmList.Filter = filterDefault;
          this._onFilmList.render();
          break;
      }
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _getCollection() {
    const Films = [];
    this._collection.forEach((element) => {
      Films.push(new Filter(element));
    });
    return Films;
  }

  get _collection() {
    const collection = this._onFilmList.collection;
    return [
      {
        title: `Favorites`,
        slug: `favorites`,
        isAdditional: false,
        count: Object.values(collection).reduce((sum, current) => +sum + +current._isFavorite, 0),
      },
      {
        title: `History`,
        slug: `history`,
        isAdditional: false,
        count: Object.values(collection).reduce((sum, current) => +sum + ((current._year <= 1970) ? 1 : 0), 0),
      },
      {
        title: `Watchlist`,
        slug: `watchlist`,
        isAdditional: false,
        count: Object.values(collection).reduce((sum, current) => +sum + +current._isWatchList, 0),
      },
      {
        title: `All movies`,
        slug: `all`,
        isAdditional: false,
        count: collection.length,
      },
    ];
  }

  set onFilmList(obj) {
    this._onFilmList = obj;
    this._dataCollection = this._getCollection();
  }

  get element() {
    return this._element;
  }

  render(container) {
    this._element = container;
    this._dataCollection.forEach((it) => {
      this._element.insertAdjacentElement(`afterbegin`, it.render());
    });
    this.addListener();
  }

  unrender() {
    this._element = null;
    this._dataCollection = null;
    this.removeListener();
  }

  addListener() {
    this._element.addEventListener(`click`, this._onDataFiltering);
  }

  removeListener() {
    this._element.removeEventListener(`click`, this._onDataFiltering);
  }
}
