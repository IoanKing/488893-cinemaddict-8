/**
 * Шаблон фильтра.
 * @param {object} element Объект с данными для фильтра.
 * @param {bool} isFirst Признак первого элемента.
 * @return {string} разметка HTML блока с фильтром.
 */
export default (element) => `<a href="#${element.slug}" class="main-navigation__item ${(element.slug === `all`) ? `main-navigation__item--active` : ``}">${element.title} ${(element.slug !== `all`) ? `<span class="main-navigation__item-count">${element.count}</span>` : ``}</a>`;
