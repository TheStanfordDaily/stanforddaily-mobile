// Learn more about deep linking with React Navigation
// https://reactnavigation.org/docs/deep-linking
// https://reactnavigation.org/docs/configuring-links

import { Routing } from "../utils/constants";

export const config = {
    screens: {
        Home: {
            path: Routing.home,
            screens: {
                Post: ":year/:month/:day/:slug",
            },
        },
    },
};
