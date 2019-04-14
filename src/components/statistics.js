import Selector from "../modules/selectors";
import Component from "./component";
import templateStatistic from "../templates/template-statistic";

export class Statistics extends Component {
  constructor(data) {
    super();
    const filteredData = Object.values(data).filter((it) => it.isWatched);
    this._genres = this._countGenres(filteredData);
    this._filmCount = Object.values(data).reduce((sum, current) => +sum + +current.isWatched, 0);
    this._watches = this._watchedFilms(filteredData);
    this._duration = this._totalDuration(filteredData);
    this._rank = this._setRank(this._filmCount);

    this._onFilterClick = this._onFilterClick.bind(this);
  }

  _onFilterClick(evt) {
    if (evt.target.classList.contains(Selector.STAT_FILTER) && typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  _setRank(filmsCount) {
    let renderText = ``;
    if (filmsCount > 1 && filmsCount <= 10) {
      renderText = `novice`;
    } else if (filmsCount > 10 && filmsCount <= 20) {
      renderText = `fan`;
    } else if (filmsCount > 20) {
      renderText = `movie buff`;
    }
    return renderText;
  }

  _totalDuration(collection) {
    return Object.values(collection).reduce((sum, current) => +sum + current.duration, 0);
  }

  _countGenres(collection) {
    const genreList = Object.values(collection).map((it) => [...it.genres].join(`, `), 0).join(`, `).split(`, `);
    const groupedGenre = genreList.reduce((obj, it) => Object.assign(obj, {[it]: (obj[it] | 0) + 1}), {});
    return Object.entries(groupedGenre).sort((a, b) => b[1] - a[1]);
  }

  _watchedFilms(collection) {
    return collection.length;
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  set update(collection) {
    const filteredData = Object.values(collection).filter((it) => it.isWatched);
    this._genres = this._countGenres(filteredData);
    this._filmCount = Object.values(collection).reduce((sum, current) => +sum + +current.isWatched, 0);
    this._watches = this._watchedFilms(filteredData);
    this._duration = this._totalDuration(filteredData);
    this._rank = this._setRank(this._filmCount);
  }

  get collection() {
    return {
      genres: this._genres,
      filmCount: this._filmCount,
      watches: this._watches,
      duration: this._duration,
      rank: this._rank,
    };
  }

  get template() {
    return templateStatistic(this.collection);
  }

  addListener() {
    this._element.querySelector(`.${Selector.STAT_FILTERS}`)
      .addEventListener(`click`, this._onFilterClick);
  }

  removeListener() {
    this._element.querySelector(`.${Selector.STAT_FILTERS}`)
      .removeEventListener(`click`, this._onFilterClick);
  }
}
