/**
 * Шаблон фильтра.
 * @param {object} element Объект с данными для фильтра.
 */
export default (element) => `
<a
  href="#${element.slug}"
  class="main-navigation__item ${(element.slug === `all`) ? `main-navigation__item--active` : ``}"
  >
    ${element.title} ${(element.slug !== `all`) ?
      `<span class="main-navigation__item-count">${element.count}</span>` 
      :``}
</a>`;
