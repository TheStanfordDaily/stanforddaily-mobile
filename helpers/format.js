const MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]

export const itemize = (elements) => {
  switch (elements.length) {
    case 0: return ""
    case 1: return elements[0]
    default:
      return elements.slice(0, -1).join(", ") + " and " + elements[elements.length - 1]
  }
}

export const formatDate = (instance, verbose) => {
    let formattedMonth = MONTHS[instance.getMonth()]
    let formattedDay = instance.getDate()
    let formattedYear = instance.getFullYear()
    let formattedHours = instance.getUTCHours() % 12
    if (formattedHours == 0) {
      formattedHours = 12
    }
    let formattedMinutes = instance.getMinutes()
    if (formattedMinutes < 10) {
      formattedMinutes = `0${formattedMinutes}`
    }
    let formattedMeridian = instance.getUTCHours() % 24 < 12 ? "a.m." : "p.m."
    return `${formattedMonth} ${formattedDay}, ${formattedYear}${verbose ? ", " + formattedHours + ":" + formattedMinutes + " " + formattedMeridian : ""}`
}

export const stringMode = (strings) => {
    return strings.sort((a,b) => strings.filter(v => v === a).length - strings.filter(v => v === b).length).pop();
}

export const sluggify = (s) => {
  s = s.replace(/^\s+|\s+$/g, ''); // trim
  s = s.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
      s = s.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  s = s.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      //.replace(/-+/g, '-'); // collapse dashes

  return s;
}