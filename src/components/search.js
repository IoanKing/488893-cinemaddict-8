import Component from "./component";
import templateSearch from "../templates/template-search";

export default class Search extends Component {
  constructor() {
    super();

    this._onSearchChange = this._onSearchChange.bind(this);
  }

  _onSearchChange(evt) {
    if (typeof this._onChange === `function`) {
      this._onChange(evt);
    }
  }

  set onChange(fn) {
    this._onChange = fn;
  }

  get template() {
    return templateSearch();
  }

  get element() {
    return this._element;
  }

  addListener() {
    this._element.addEventListener(`input`, this._onSearchChange);
  }

  removeListener() {
    this._element.removeEventListener(`input`, this._onSearchChange);
  }
}
