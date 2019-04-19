import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {ChartSettings} from "../modules/utils";

export default (statisticCtx, collection) => {
  statisticCtx.height = ChartSettings.BAR_HEIGHT * collection.genres.length;
  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: collection.genres.map((it) => it[0]),
      datasets: [{
        data: collection.genres.map((it) => it[1]),
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
};
