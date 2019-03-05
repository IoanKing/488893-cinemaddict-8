import {getRandomInt, getRandomElement, getRandomFloat} from "./utils";

const MAX_MOVIE_COUNT = 20;
const DEFAULT_MOVIE_COUNT = 7;

const MIN_COMMENT_COUNT = 0;
const MAX_COMMENT_COUNT = 30;

const MIN_SENTENTES = 1;
const MAX_SENTENTES = 3;

const Ratings = {
  MIN: 80,
  MAX: 100
};

const Duration = {
  MIN: 55,
  MAX: 145
};

const Years = {
  MIN: 1965,
  MAX: 2018
};


const MockData = {
  TITLES: [
    `Far Far Far Away`,
    `Incredibles 2`,
    `WALL-E`,
    `Blackmail`,
    `R.A.B.B.I.T`,
    `Rabbit of the OZ`,
    `Last agent 999`,
    `Bad romance`,
    `Lost in Grimlok`,
    `Detective agency Murlok`,
    `Attack to the Shtormgrade`,
    `Adventure of the Lemmingtoon`,
    `Train to the Hell`,
    `Lord if the apples`,
    `Gorgeous ten`,
    `Alice and smallworld`],
  ADDITIONAL: [true, false],
  GENRES: [
    `Comedy`,
    `Horror`,
    `Action`,
    `Dram`,
    `Adventure`,
    `Animation`
  ],
  TEXTS: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`,
  ]
};

const FilterMockData = [
  {
    title: `All movies`,
    slug: `all`,
    count: 0,
  },
  {
    title: `Watchlist`,
    slug: `watchlist`,
    count: 13,
  },
  {
    title: `History`,
    slug: `history`,
    count: 4,
  },
  {
    title: `Favorites`,
    slug: `favorites`,
    count: 8,
  }
];

const getCard = () => ({
  title: MockData.TITLES[getRandomInt(0, MockData.TITLES.length)],
  rating: getRandomFloat(Ratings.MIN, Ratings.MAX),
  year: getRandomInt(Years.MIN, Years.MAX),
  duration: getRandomInt(Duration.MIN, Duration.MAX),
  genre: MockData.GENRES[getRandomInt(0, MockData.GENRES.length)],
  poster: `http://picsum.photos/232/342?r=${Math.random()}`,
  description: new Array(getRandomInt(MIN_SENTENTES, MAX_SENTENTES))
  .fill()
  .map(() => getRandomElement(MockData.TEXTS)).join(` `),
  comments: new Array(getRandomInt(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT))
    .fill()
    .map(() => getRandomElement(MockData.TEXTS)),
  isAdditional: MockData.ADDITIONAL[getRandomInt(0, MockData.ADDITIONAL.length)]
});

/**
 * Генерация коллекции случайных карточек задач.
 * @param {number} countCollection количество карточек задач.
 * @return {object} коллекция объектов.
 */
const getMockCollection = (countCollection) => {
  let collection = new Array(countCollection)
    .fill()
    .map(() => getCard());
  return collection;
};

export {MAX_MOVIE_COUNT, DEFAULT_MOVIE_COUNT, MAX_COMMENT_COUNT, MockData, FilterMockData, getMockCollection};
