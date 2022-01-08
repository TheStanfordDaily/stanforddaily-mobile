import WPAPI from "wpapi";
import tsdJson from "./tsd-json.json";
import { STRINGS}  from '../assets/constants.js';

const wp = new WPAPI({
  endpoint: `${STRINGS.WP_URL}/wp-json`,
});

export async function getHomeAsync(id) {
  return wp.posts().categories(id).embed()
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