import { Dimensions, PixelRatio, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import "moment-timezone";

const {width, height} = Dimensions.get('window');
const scale = width/320

export const formatDate = post => moment.utc(post.postDateGmt).tz("America/Los_Angeles").toDate().toLocaleDateString();
export const getThumbnailURL = ({thumbnailInfo}) => thumbnailInfo ? (thumbnailInfo.urls.mediumLarge || thumbnailInfo.urls.full): null;
// export const formatAuthors = ({tsdAuthors}) => (tsdAuthors || []).map(e => e.displayName).join(", ");
export const itemize = (elements) => {
    return [elements.slice(0, -1).join(", "), elements.length > 2 ? elements.last() : elements].join(" and ")
}
export function normalize(size) {
    const newSize = size * scale 
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export function decodeEntityHTML(message) {
    const doc = new DOMParser().parseFromString(message, "text/html");
    return doc.documentElement.textContent;
}

// const inferred = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }) // undefined means it auto-detects locale
// const DIVISIONS = [
//     { amount: 60, name: 'seconds' },
//     { amount: 60, name: 'minutes' },
//     { amount: 24, name: 'hours' },
//     { amount: 7, name: 'days' },
//     { amount: 4.34524, name: 'weeks' },
//     { amount: 12, name: 'months' },
//     { amount: Number.POSITIVE_INFINITY, name: 'years' }
//   ]

// export function relativeDate(date) {    
//     let duration = (date - new Date()) / 1000

//     for (let i = 0; i <= DIVISIONS.length; i++) {
//     const division = DIVISIONS[i]
//     if (Math.abs(duration) < division.amount) {
//         return inferred.format(Math.round(duration), division.name)
//     }
//     duration /= division.amount
//     }
// }