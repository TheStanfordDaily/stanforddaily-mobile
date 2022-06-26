import WPAPI from "wpapi";
import tsdJson from "./tsd.json";
import { Strings }  from '../constants';

const wp = new WPAPI({
  endpoint: `${Strings.wordPressURL}/wp-json`,
});
// const wpTsdJson = wp.namespace("tsd/json/v1");

export async function getHomeAsync(id) {
  return wp.posts().categories(id).embed()
}

export async function getCategoryPageAsync(id, page) {
  return wp.posts().categories(id).page(page).embed()
}

export async function getHomeMoreAsync(
  extraPageNumber
) {
  return wpTsdJson
    .home()
    .more()
    .extraPageNumber(extraPageNumber);
}

export async function getPostAsync(id) {
  return wp.posts().id(id).embed()
}

export async function getCategoryAsync(
  categorySlugs,
  pageNumber,
) {
  // Rewrite @94305
  let slugs = [...categorySlugs];
  for (let i in slugs) {
    if (slugs[i] === "@94305" || slugs[i] === "data-vizzes") {
      slugs[i] = "94305";
    }
  }

  return wpTsdJson
    .category()
    .categorySlugs(slugs.map(encodeURIComponent).join("/"))
    .pageNumber(pageNumber);
}

export async function getPostByIdAsync(id) {
  return wpTsdJson.postsId().postId(id);
}