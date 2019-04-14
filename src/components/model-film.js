export default class ModelFilm {
  constructor(data) {
    this.id = data[`id`];

    this.actors = new Set(data[`film_info`].actors || []);
    this.age = data[`film_info`].age_rating;
    this.original = data[`film_info`].alternative_title || ``;
    this.description = data[`film_info`].description || ``;
    this.director = data[`film_info`].director || ``;
    this.genres = new Set(data[`film_info`].genre || []);
    this.poster = data[`film_info`].poster;
    this.release = new Date(data[`film_info`].release.date);
    this.country = data[`film_info`].release.release_country;
    this.duration = Number(data[`film_info`].runtime);
    this.title = data[`film_info`].title || ``;
    this.totalRating = data[`film_info`].total_rating;
    this.writers = new Set(data[`film_info`].writers || []);

    this.comments = data[`comments`] || [];

    this.userRating = data[`user_details`].personal_rating;
    this.isWatched = Boolean(data[`user_details`].already_watched);
    this.isFavorites = Boolean(data[`user_details`].favorite);
    this.isWatchList = Boolean(data[`user_details`].watchlist);

    this.watchedDate = new Date(data[`user_details`].watching_date);
  }

  toRAW() {
    const object = {
      'id': this.id,
      'film_info': {
        'actors': Array.from(this.actors),
        'age_rating': this.age,
        'alternative_title': this.original,
        'description': this.description,
        'director': this.director,
        'genre': Array.from(this.genres),
        'poster': this.poster,
        'release': {
          'date': this.release,
          'release_country': this.country,
        },
        'runtime': this.duration,
        'title': this.title,
        'total_rating': this.totalRating,
        'writers': Array.from(this.writers),
      },
      'user_details': {
        'personal_rating': this.userRating,
        'already_watched': this.isWatched,
        'favorite': this.isFavorites,
        'watchlist': this.isWatchList,
        'watching_date': this.watchedDate
      },
      'comments': Array.from(this.comments),
    };
    return object;
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }
}
