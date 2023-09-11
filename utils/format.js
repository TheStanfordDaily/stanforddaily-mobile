import Model from "./model";

const MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

/**
 * Converts an array of elements into a string, with each element separated by a comma,
 * with "and" coming right before the name of the last author in the list.
 * Per AP style, Oxford commas are omitted.
 * @function
 * @param {Array<string>} elements - The sequence of names.
 * @returns {string} A string representation of the sequence.
 */
export const itemize = (elements) => {
  switch (elements.length) {
    case 0:
      return "";
    case 1:
      return elements[0];
    default:
      return elements.slice(0, -1).join(", ") + " and " + elements.at(-1);
  }
};

/**
 * Formats a Date instance into a string following AP style.
 * @function
 * @param {Date} instance - The Date instance to format.
 * @param {boolean} verbose - Whether to include the time in the formatted string.
 * @returns {string} A string representation of the date.
 */
export const formatDate = (instance, verbose) => {
  const formattedMonth = MONTHS[instance.getMonth()];
  const formattedDay = instance.getDate();
  const formattedYear = instance.getFullYear();
  let formattedHours = instance.getHours() % 12;
  if (formattedHours === 0) {
    formattedHours = 12;
  }
  let formattedMinutes = instance.getMinutes();
  if (formattedMinutes < 10) {
    formattedMinutes = `0${formattedMinutes}`;
  }
  const formattedMeridian = instance.getHours() < 12 ? "a.m." : "p.m.";

  return `${formattedMonth} ${formattedDay}, ${formattedYear}${
    verbose ? ", " + formattedHours + ":" + formattedMinutes + " " + formattedMeridian : ""
  }`;
};

/**
 * Finds the string that occurs most frequently in an array of strings.
 * @function
 * @param {Array<string>} strings - An input array of strings.
 * @returns {string} The mode.
 */
export const stringMode = (strings) => {
  return strings.sort((a, b) => strings.filter((v) => v === a).length - strings.filter((v) => v === b).length).pop();
};

/**
 * Generates a URL-friendly slug from a string.
 * Used to generate slugs for the Ad Auris audio URL.
 * Modified from https://gist.github.com/codeguy/6684588 to keep dashes instead of collapsing them.
 * TODO: Adapt one of the simpler solutions listed on the page.
 * @function
 * @param {string} s - The string to convert into a slug.
 * @returns {string} The result of the conversion.
 */
export const generateSlug = (s) => {
  s = s.replace(/^\s+|\s+$/g, "");
  s = s.toLowerCase();

  const source = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;\u2018\u2019";
  const destination = "aaaaeeeeiiiioooouuuunc----------";
  for (let i = 0, l = source.length; i < l; i++) {
    s = s.replace(new RegExp(source.charAt(i), "g"), destination.charAt(i));
  }

  return s.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
};

/**
 * Retrieves the active route information from the navigation state.
 *
 * This function recursively traverses the navigation state to find the deepest active route.
 * This is useful when you need to know which screen is currently being displayed to the user.
 *
 * @function
 * @param {Object} state - The navigation state.
 * @returns {Record<string, string>} An object containing the name of the active route and the current datetime.
 */
export function getActiveRouteInfo(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // Traverse the nested navigators.
  if (route.routes) {
    return getActiveRouteInfo(route);
  }

  const out = {
    name: route.name,
    datetime: new Date().toISOString(),
  };

  if (route.params?.article?.id) {
    out["id"] = route.params?.article?.id;
  }

  return out;
}

/**
 * Validates the Firebase configuration for the Realtime Database by returning a Boolean indicating whether the configuration is valid.
 * The required properties are: `apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId` and `serviceAccountId`.
 *
 * This is important to ensure that the application has all the necessary information to connect to the Firebase Realtime Database without any errors.
 *
 * @function
 * @param {Record<string, string>} config - The Firebase configuration object.
 * @returns {boolean} True if the configuration object contains all required properties and is therefore valid, false otherwise.
 */
export function validateConfig(config) {
  return Object.keys(config).every((key) => key !== undefined && key !== "" && key !== null);
}

/**
 * Retrieves the most common tags from recent posts.
 *
 * This function fetches the specified number of recent posts, counts the occurrences of each tag, and returns the most common tags.
 * This is useful for displaying a tag cloud or similar feature where you want to highlight the most popular topics.
 *
 * @async
 * @function
 * @param {number} numRecentPosts - The number of recent posts to fetch.
 * @param {number} numTopTags - The number of top tags to return.
 * @param {Array<number>} excludedTags - An array of tag IDs to exclude from the count.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of the most common tags.
 */
export const getMostCommonTagsFromRecentPosts = async (
  numRecentPosts = 10,
  numTopTags = 10,
  excludedTags = [35626]
) => {
  try {
    const recentPosts = await Model.posts().perPage(numRecentPosts).embed();
    const tagCounts = {};

    for (const post of recentPosts) {
      const tags = post._embedded["wp:term"][1];

      for (const tag of tags) {
        if (excludedTags.includes(tag.id)) continue;

        if (tagCounts[tag.id]) {
          tagCounts[tag.id].count += 1;
        } else {
          tagCounts[tag.id] = { ...tag, count: 1 };
        }
      }
    }

    const sortedByCount = Object.values(tagCounts).sort((a, b) => b.count - a.count);
    const mostCommonTags = sortedByCount.slice(0, numTopTags);

    return mostCommonTags;
  } catch (error) {
    console.error("Error fetching tags from recent posts:", error);
    return [];
  }
};

/**
 * Extracts the second part of a string containing the pipe `|` character.
 * This is useful for headlines that are prefaced with a label.
 *
 * @function
 * @param {string} headline - The headline to parse, typically from WordPress API.
 * @returns {string} The second part of the headline, after the pipe character.
 *
 * @example const headline = parsePipedHeadline("Humor | Open letter to the random I always see on campus")
 */
export function parsePipedHeadline(headline) {
  const splitHeadline = headline.split(/\s*\|\s*/);
  if (splitHeadline.length > 1) {
    return splitHeadline[1];
  }

  // Return the whole headline if there's no pipe character.
  return headline;
}
