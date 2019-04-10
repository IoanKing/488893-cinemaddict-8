import Component from "./component";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ChartSettings} from "../modules/utils";

export class Statistics extends Component {
  constructor(data) {
    super();
    const filteredData = Object.values(data).filter((it) => it.isWatched);
    this._genres = this._countGenres(filteredData);
    this._watches = filteredData.length;
    this._duration = this._totalDuration(filteredData);
    this._rank = this._setRank();
  }

  _setRank() {
    switch (this._genres[0][0]) {
      case `TV Series`:
        return `Cериальный маньяк`;
      case `Horror`:
        return `Поклонник ужасов`;
      case `Action`:
        return `Герой боевика`;
      case `Animation`:
        return `Вечный ребенок`;
      case `Sci-Fi`:
        return `Путешевственник во времени`;
      case `Comedy`:
        return `Юморист`;
      case `Adventure`:
        return `Искатель приключений`;
      case `Dram`:
        return `Писсимист`;
      default:
        return (this._duration >= 100) ? `Кино-маньяк` : `Любитель`;
    }
  }

  _totalDuration(collection) {
    return Object.values(collection).reduce((sum, current) => +sum + current.duration, 0);
  }

  _countGenres(collection) {
    const genreList = Object.values(collection).map((it) => [...it.genres].join(`, `), 0).join(`, `).split(`, `);
    const groupedGenre = genreList.reduce((obj, it) => Object.assign(obj, {[it]: (obj[it] | 0) + 1}), {});
    return Object.entries(groupedGenre).sort((a, b) => b[1] - a[1]);
  }

  get template() {
    const durationHour = (this._duration >= 60) ?
      `${Math.floor(this._duration / 60)}<span class="statistic__item-description">H</span> ${this._duration % 60}<span class="statistic__item-description">m</span>` :
      `${this._duration}<span class="statistic__item-description">m</span>`;
    return `
    <section class="statistic">
      <p class="statistic__rank">Your rank <span class="statistic__rank-label">${this._rank}</span></p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters visually-hidden">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${this._watches}<span class="statistic__item-description">movie${(this._watches > 1) ? `s` : ``}</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${durationHour}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${this._genres[0][0]}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>
    `.trim();
  }

  renderChart(statisticCtx) {
    // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
    statisticCtx.height = ChartSettings.BAR_HEIGHT * this._genres.length;
    const myChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._genres.map((it) => it[0]),
        datasets: [{
          data: this._genres.map((it) => it[1]),
          backgroundColor: ChartSettings.BACKGROUND_COLOR,
          hoverBackgroundColor: ChartSettings.BACKGROUND_COLOR,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          dataLabels: {
            font: {
              size: ChartSettings.FONT_SIZE
            },
            color: ChartSettings.COLOR,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: ChartSettings.COLOR,
              padding: 100,
              fontSize: ChartSettings.FONT_SIZE
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
    return myChart;
  }
}
