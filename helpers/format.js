import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const scale = width/320
const MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]

// export const formatAuthors = ({tsdAuthors}) => (tsdAuthors || []).map(e => e.displayName).join(", ");
export const itemize = (elements) => {
    return [elements.slice(0, -1).join(", "), elements.length > 2 ? elements.last() : elements].join(" and ")
}

export function decodeEntityHTML(message) {
    const doc = new DOMParser().parseFromString(message, "text/html");
    return doc.documentElement.textContent;
}

export const formatDate = (instance) => {
    let formattedMonth = MONTHS[instance.getMonth()]
    let formattedDay = instance.getDate()
    let formattedYear = instance.getFullYear()
    let formattedHours = instance.getHours() % 12
    if (formattedHours == 0) {
      formattedHours = 12
    }
    let formattedMinutes = instance.getMinutes()
    if (formattedMinutes < 10) {
      formattedMinutes = `0${formattedMinutes}`
    }
    let formattedMeridian = instance.getUTCHours % 24 < 7 ? "a.m." : "p.m."
    return `${formattedMonth} ${formattedDay}, ${formattedYear}, ${formattedHours}:${formattedMinutes} ${formattedMeridian}`
}
