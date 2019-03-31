export default class ModelFilm {
  constructor(data) {
    this.id = data[`id`];
    this._title = data[`title`] || ``;
    this._original = data[`original`] || ``;
    this._totalRating = data[`totalRating`];
    this._userRating = data[`userRating`];
    this._director = data[`director`] || ``;
    this._writers = data[`writers`] || ``;
    this._authors = data[`authors`] || ``;
    this._realise = new Date(data[`realise`]);
    this._duration = Number(data[`duration`]);
    this._genres = new Set(data[`genres`] || []);
    this._poster = data[`poster`];
    this._description = data[`description`];
    this._comments = new Set(data[`comments`] || []);
    this._country = data[`country`] || ``;
    this._age = data[`age`];

    this._isWatched = Boolean(data[`is_watched`]);
    this._isFavorites = Boolean(data[`is_favorites`]);
    this._isWatchList = Boolean(data[`is_watchList`]);
  }

  toRAW() {
    return {
      'id': this._id,
      'title': this._title,
      'original': this._original,
      'totalRating': this._totalRating,
      'userRating': this._userRating,
      'director': this._director,
      'writers': this._writers,
      'authors': this._authors,
      'realise': this._realise,
      'duration': this._duration,
      'genres': this._genres,
      'poster': this._poster,
      'description': this._description,
      'comments': [...this._comments],
      'country': this._country,
      'age': this._age,
      'is_watched': this._isWatched,
      'is_favorites': this._isFavorites,
      'is_watchList': this._isWatchList,
    };
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }
}
