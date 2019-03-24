import {getRandomInt, getRandomElement, getRandomFloat} from "./utils";

const MAX_MOVIE_COUNT = 30;

const MIN_COMMENT_COUNT = 0;
const MAX_COMMENT_COUNT = 10;

const MIN_SENTENTES = 1;
const MAX_SENTENTES = 3;

const MAX_ACTORS = 7;

const TimeConstants = {
  YEAR_COUNTS: 50,
  MONTH_COUNT: 2,
  DAYS_COUNT: 7,
  HOUR_COUNTS: 24,
  MINUTES_COUNT: 60,
  SECONDS_COUNT: 60,
  MSECONDS_COUNT: 1000,
};

const Ratings = {
  MIN: 80,
  MAX: 100
};

const UserRatings = {
  MIN: 1,
  MAX: 9
};

const Duration = {
  MIN: 55,
  MAX: 145
};

const MockComment = {
  EMOJI: [
    `😴`,
    `😐`,
    `😀`,
  ],
  TEXT: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`,
  ],
  AUTHOR_NAME: [
    `Tom`,
    `Jerry`,
    `Nikolas`,
    `Smith`,
    `Mike`,
    `Duglas`,
    `John`,
    `Adam`,
    `Poll`,
    `Nikole`,
  ],
  AUTHON_SURNAME: [
    `Smith`,
    `Malkovish`,
    `Duglas`,
    `Kidman`,
    `Iovich`,
    `Roogue`,
    `Paladin`,
    `Fury`,
    `Flash`,
    `Corrvil`,
  ],
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
  AGE: [
    `0+`,
    `12+`,
    `14+`,
    `18+`
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
  ],
  AUTHORS: [
    `Stephen Graham`,
    `Jamie Bell`,
    `Sam Worthington`,
    `Tim Robbins`,
    `Zach Galifianakis`,
    `Ed Helms`,
    `Bradley Cooper`,
    `Pierce Brosnan`,
    `Samuel L. Jackson`,
    `Uma Thurman`,
    `Hilary Swank`,
    `Amanda Bynes`,
    `Mila Kunis`,
    `Emma Stone`,
    `Kate Bosworth`,
    `Penélope Cruz`,
    `Sandra Bullock`,
    `Zooey Deschane`,
  ],
  DIRECTORS: [
    `Martin Scorsese`,
    `Peter Jackson`,
    `Steven Spielberg`,
    `Tim Burton`,
    `David Fincher`,
    `David Lynch`,
    `Christopher Nolan`,
    `Milos Forman`,
    `Ridley Scott`,
    `James Cameron`,
    `Marek Piestrak`,
    `Freddie Francis`,
    `Danny Boyle`,
    `Francis Ford Coppola`,
    `David Cronenberg`,
    `George Miller`,
    `Stanley Kubrick`,
  ],
  WRITERS: [
    `Christopher Nolan`,
    `Luc Besson`,
    `John Hughes`,
    `Martin Scorsese`,
    `Stephen King`,
    `Guy Ritchie`,
    `Danny Boyle`,
    `Quentin Tarantino`,
  ],
  COUNTRY: [
    `USA`,
    `France`,
    `Germany`,
    `Japan`,
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
  },
  {
    title: `Stats`,
    slug: `stats`,
    count: 8,
  }
];

const getFilm = () => ({
  title: MockData.TITLES[getRandomInt(0, MockData.TITLES.length)],
  original: MockData.TITLES[getRandomInt(0, MockData.TITLES.length)],
  totalRating: getRandomFloat(Ratings.MIN, Ratings.MAX),
  userRating: getRandomInt(UserRatings.MIN, UserRatings.MAX),
  realise: Date.now() - Math.floor(Math.floor(Math.random() * TimeConstants.YEAR_COUNTS) * Math.floor(Math.random() * TimeConstants.MONTH_COUNT) * Math.floor(Math.random() * TimeConstants.DAYS_COUNT)),
  director: getRandomElement(MockData.DIRECTORS),
  writers: new Set(new Array(getRandomInt(MIN_SENTENTES, MAX_SENTENTES))
  .fill()
  .map(() => getRandomElement(MockData.WRITERS))),
  authors: new Set(new Array(getRandomInt(MIN_SENTENTES, MAX_ACTORS))
  .fill()
  .map(() => getRandomElement(MockData.AUTHORS))),
  country: getRandomElement(MockData.COUNTRY),
  duration: getRandomInt(Duration.MIN, Duration.MAX),
  genres: new Set(new Array(getRandomInt(MIN_SENTENTES, MAX_SENTENTES))
    .fill()
    .map(() => getRandomElement(MockData.GENRES))),
  poster: `http://picsum.photos/232/342?r=${Math.random()}`,
  description: new Array(getRandomInt(MIN_SENTENTES, MAX_SENTENTES))
  .fill()
  .map(() => getRandomElement(MockData.TEXTS)).join(` `),
  comments: new Array(getRandomInt(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT))
    .fill()
    .map(() => ({
      emoji: getRandomElement(MockComment.EMOJI),
      author: `${getRandomElement(MockComment.AUTHOR_NAME)} ${getRandomElement(MockComment.AUTHON_SURNAME)}`,
      published: Date.now() - Math.floor(Math.random() * TimeConstants.DAYS_COUNT * TimeConstants.DAYS_COUNT) * TimeConstants.HOUR_COUNTS * Math.floor(Math.random() * TimeConstants.MINUTES_COUNT) * Math.floor(Math.random() * TimeConstants.SECONDS_COUNT) * TimeConstants.MSECONDS_COUNT,
      text: new Array(getRandomInt(MIN_SENTENTES, MAX_SENTENTES))
      .fill()
      .map(() => getRandomElement(MockData.TEXTS)).join(` `),
    })),
  isWatched: MockData.ADDITIONAL[getRandomInt(0, MockData.ADDITIONAL.length)],
  isFavorites: MockData.ADDITIONAL[getRandomInt(0, MockData.ADDITIONAL.length)],
  isWatchList: MockData.ADDITIONAL[getRandomInt(0, MockData.ADDITIONAL.length)],
  age: MockData.AGE[getRandomInt(0, MockData.AGE.length)]
});

/**
 * Генерация коллекции случайных карточек задач.
 * @param {number} countCollection количество карточек задач.
 * @return {object} коллекция объектов.
 */
const getMockCollection = () => {
  let collection = new Array(MAX_MOVIE_COUNT)
    .fill()
    .map(() => getFilm());
  return collection;
};

const mockdata = getMockCollection();

export {mockdata, FilterMockData};
