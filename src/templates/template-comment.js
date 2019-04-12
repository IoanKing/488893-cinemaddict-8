
import moment from "moment";
import {Emoji} from "../modules/utils";

const templateComment = (comment) => {
  const nowDate = new Date();
  const timeAgo = moment.duration(moment(nowDate).diff(comment.date));
  let timeText = ``;

  if (timeAgo.get(`years`) > 0) {
    timeText = `${timeAgo.get(`years`)} years`;
  } else if (timeAgo.get(`months`) > 0) {
    timeText = `${timeAgo.get(`months`)} months`;
  } else if (timeAgo.get(`days`) > 0) {
    timeText = `${timeAgo.get(`days`)} days`;
  } else if (timeAgo.get(`hours`) > 0) {
    timeText = `${timeAgo.get(`hours`)} hours`;
  } else if (timeAgo.get(`minutes`) > 0) {
    timeText = `${timeAgo.get(`minutes`)} minutes`;
  } else if (timeAgo.get(`seconds`) > 0) {
    timeText = `${timeAgo.get(`seconds`)} seconds`;
  } else {
    timeText = `second`;
  }

  return `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">${Emoji[comment.emotion]}</span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${timeText} ago</span>
      </p>
    </div>
  </li>`.trim();
};

export default (comments) => {
  const sortedComments = Object.values(comments).sort((a, b) => b.date - a.date);
  return Array.from(sortedComments).map((comment) => templateComment(comment)).join(``);
};
