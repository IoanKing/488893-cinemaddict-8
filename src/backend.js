import {getRandomString} from "./utils";

const AUTHORIZATION = `Basic ${getRandomString()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/movie`;

const TIMEOUT_REQUEST = 10000;

const ErrorText = {
  ANSWER_STATUS: `Не удалось получить данные: `,
  CONNECTION: `Произошла ошибка соединения`,
  TIMEOUT_BEGIN: `Запрос не успел выполниться за `,
  TIMEOUT_END: `мс`
};

const sendRequest = function (onLoad, onError) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;
  xhr.authorization = AUTHORIZATION;

  xhr.addEventListener(`load`, function () {
    if (xhr.status === 200) {
      onLoad(xhr.response);
    } else {
      onError(ErrorText.ANSWER_STATUS + xhr.statusText);
    }
  });
  xhr.addEventListener(`error`, function () {
    onError(ErrorText.CONNECTION);
  });
  xhr.addEventListener(`timeout`, function () {
    onError(ErrorText.TIMEOUT_BEGIN + xhr.timeout + ErrorText.TIMEOUT_END);
  });

  xhr.timeout = TIMEOUT_REQUEST;
  xhr.withCredentials = true;

  xhr.open(`GET`, `${END_POINT}`);

  xhr.send();

  console.log(xhr);
};

const renderSendPopup = function (status) {
  console.log(`ДАННЫЕ ПОЛУЧЕНЫ!!! ${status}`);
};

const successMessage = renderSendPopup(`success`);
const errorMessage = renderSendPopup(`error`);

const onConnectionError = function (message) {
  console.log(`ERROR: ${message}`);
};

export {
  sendRequest as onSendData,
  sendRequest as onLoadData,
  onConnectionError,
  successMessage,
  errorMessage
};
