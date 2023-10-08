import _ from "lodash";
import { useEffect, useState } from "react";

import { Sections } from "../utils/constants";
import Model from "../utils/model";

const BATCH_SIZE = 6;
const PAGE_SIZE = 12;
const homeCount = BATCH_SIZE * Object.keys(Sections).length;

/**
 * This custom hook retrieves posts from a WordPress site via `Model`.
 * It fetches posts based on different categories and includes pagination. It returns an object
 * containing the retrieved data, articles, loading status, and any error occurred during the fetch.
 * Data fetching only runs in `useWordPress` when the component mounts, or if `pageNumber` changes.
 *
 * @param {number} pageNumber - The page number to fetch from WordPress. Defaults to 1.
 * @returns {Object} - An object containing the retrieved data, articles, loading status, and any error occurred during the fetch.
 * @example const { data, articles, desks, loading, error } = useWordPress();
 */
export const useWordPress = (pageNumber = 1) => {
  const [data, setData] = useState({});
  const [articles, setArticles] = useState({});
  const [desks, setDesks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    Object.values(Sections).forEach(async (category) => {
      try {
        // FIXME: Some Humor articles are not properly displaying the image from `wp:featuredmedia`.
        const response = await Model.posts().embed().categories(category.id).perPage(BATCH_SIZE).page(pageNumber).get();
        setData((prevState) => ({
          ...prevState,
          [category.slug]: [...(category.slug in prevState ? prevState[category.slug] : []), ...response],
        }));

        if (pageNumber === 1) {
          setArticles((prevState) => ({
            ...prevState,
            [category.slug]: response.filter((item) => {
              return !item.categories.includes(Sections.FEATURED.id) || category.slug === Sections.FEATURED.slug;
            }),
          }));

          if (category.slug === Sections.ARTS_LIFE.slug || category.slug === Sections.THE_GRIND.slug) {
            setArticles((prevState) => ({
              ...prevState,
              culture: [...(prevState?.culture ?? []), ..._.shuffle(response)],
            }));
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
        if (category.desks) {
          Object.values(category.desks).forEach(async (desk) => {
            try {
              const response = await Model.posts()
                .embed()
                .categories(desk.id)
                .perPage(BATCH_SIZE)
                .page(pageNumber)
                .get();
              setDesks((prevState) => ({
                ...prevState,
                [category.slug]: {
                  ...prevState[category.slug],
                  [desk.slug]: [...(prevState[category.slug]?.[desk.slug] ?? []), ...response],
                },
              }));
            } catch (error) {
              setError(error);
            } finally {
              setLoading(false);
            }
          });
        }
      }
    });

    Model.posts()
      .perPage(PAGE_SIZE)
      .page(pageNumber + Math.ceil(homeCount / PAGE_SIZE) + 1)
      .embed()
      .get()
      .then((posts) => {
        setData((prevState) => ({
          ...prevState,
          wildcard: [
            ...(prevState?.wildcard ?? []),
            ...posts.filter((post) => {
              return !Object.keys(articles).some((category) => articles[category].some((item) => item.id === post.id));
            }),
          ],
        }));
      });
  }, [pageNumber]);

  return { data, articles, desks, loading, error };
};
