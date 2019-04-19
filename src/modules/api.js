import ModelFilm from "../components/model-film";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

/**
 * Проверка статуса ответа сервера и возращение его в качестве рузультата.
 * @param {string} response - ответ сервера.
 * @return {string} - ответ сервера.
 */
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

/**
 * Перевод ответа сервера в формат JSON..
 * @param {string} response - ответ сервера.
 * @return {object} - json обьект.
 */
const toJSON = (response) => {
  return response.json();
};

const API = class {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelFilm.parseFilms);
  }

  updateFilm({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelFilm.parseFilm);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers, withCredentials: true})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
