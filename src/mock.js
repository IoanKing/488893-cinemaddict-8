import {getRandomInt, getRandomElement} from "./utils";

const MAX_MOVIE_COUNT = 20;
const DEFAULT_MOVIE_COUNT = 7;
const MAX_COMMENT_COUNT = 30;

const MockData = {
  TITLES: [`The Assassination Of Jessie James By The Coward Robert Ford`,
    `Incredibles 2`,
    `WALL-E`,
    `Blackmail`,
    `Z.A.W`,
    `Rabbit of the OZ`,
    `Last agent 999`,
    `Bad romance`,
    `Lost in Grimlok`,
    `Detective agency Murlok`,
    `Attack to the Shtormgrade`,
    `Adventure of the Lemmingtoon`,
    `Train to the Hell`,
    `Lord if the apples`,
    `Gorgeous ten`],
  ADDITIONAL: [true, false],
  RATINGS: [`9.8`, `8.1`, `7.8`, `9.5`, `8.9`, `9.1`, `6.5`, `2.0`, `7.5`, `9.3`],
  YEARS: [`2018`, `2017`, `2016`, `2015`, `2014`, `2013`, `2012`, `2011`, `2010`, `2009`, `2008`, `2007`, `2006`, `2005`],
  DURATIONS: [`1h&nbsp;13m`, `1h&nbsp;20m`, `1h&nbsp;15m`, `1h&nbsp;05m`, `1h&nbsp;00m`, `2h&nbsp;10m`, `1h&nbsp;40m`, `1h&nbsp;35m`, `1h&nbsp;45m`, `55m`],
  GENRES: [`Comedy`, `Horror`, `Action`, `Dram`, `Adventure`],
  IMAGES: [`blue-blazes.jpg`,
    `accused.jpg`,
    `blackmail.jpg`,
    `fuga-da-new-york.jpg`,
    `moonrise.jpg`,
    `three-friends.jpg`],
  COMMENTS: [`Комментарий 1`, `Комментарий 2`, `Комментарий 3`, `Комментарий 4`],
  DESCTIPTIONS: [`A priest with a haunted past and a novice on the threshold of her final vows are sent by the Vatican to investigate the death of a young nun in Romania and confront a malevolent force in the form of a demonic nun.`,
    `A priests Romania and confront a malevolent force in the form of a demonic nun.`]
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

/**
 * Генерация коллекции случайных карточек задач.
 * @param {number} countCollection количество карточек задач.
 * @return {object} коллекция объектов.
 */
const getMockCollection = (countCollection) => {
  const collection = [];
  for (let i = 0; i < countCollection; i++) {
    const countComment = getRandomInt(0, MAX_COMMENT_COUNT);
    const newComments = [];
    const commentData = MockData.COMMENTS.slice();
    for (let j = 0; j < countComment; j++) {
      const tagIndex = getRandomInt(0, commentData.length);
      newComments.push(commentData[tagIndex]);
    }
    const newElement = {
      title: getRandomElement(MockData.TITLES),
      isAdditional: getRandomElement(MockData.ADDITIONAL),
      rating: getRandomElement(MockData.RATINGS),
      year: getRandomElement(MockData.YEARS),
      duration: getRandomElement(MockData.DURATIONS),
      genre: getRandomElement(MockData.GENRES),
      poster: getRandomElement(MockData.IMAGES),
      description: getRandomElement(MockData.DESCTIPTIONS),
      comments: newComments,
    };
    collection.push(newElement);
  }
  return collection;
};

export {MAX_MOVIE_COUNT, DEFAULT_MOVIE_COUNT, MAX_COMMENT_COUNT, MockData, FilterMockData, getMockCollection};
