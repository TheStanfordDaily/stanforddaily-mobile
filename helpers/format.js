import { Dimensions, PixelRatio } from 'react-native';
import moment from 'moment';
import "moment-timezone";

const {width, height} = Dimensions.get('window');
const scale = width/320

export const formatDate = post => moment.utc(post.postDateGmt).tz("America/Los_Angeles").toDate().toLocaleDateString();
export const getThumbnailURL = ({thumbnailInfo}) => thumbnailInfo ? (thumbnailInfo.urls.mediumLarge || thumbnailInfo.urls.full): null;
export const formatAuthors = ({tsdAuthors}) => (tsdAuthors || []).map(e => e.displayName).join(", ");
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