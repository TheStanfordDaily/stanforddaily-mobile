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
    let formattedHours = instance.getHours() % 12
    if (formattedHours === 0) {
      formattedHours = 12
    }
    let formattedMinutes = instance.getMinutes()
    if (formattedMinutes < 10) {
      formattedMinutes = `0${formattedMinutes}`
    }
    let formattedMeridian = instance.getHours() < 12 ? "a.m." : "p.m."
    
    return `${formattedMonth} ${formattedDay}, ${formattedYear}${verbose ? ", " + formattedHours + ":" + formattedMinutes + " " + formattedMeridian : ""}`
}

export const stringMode = (strings) => {
    return strings.sort((a,b) => strings.filter(v => v === a).length - strings.filter(v => v === b).length).pop();
}

// Modified from https://gist.github.com/codeguy/6684588 to keep dashes instead of collapsing them.
// Used to generate slugs for the Ad Auris audio URL.
// TODO: Adapt one of the simpler solutions listed on the page.

export const generateSlug = (s) => {
  s = s.replace(/^\s+|\s+$/g, '')
  s = s.toLowerCase()

  var source = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;\u2018\u2019"
  var destination   = "aaaaeeeeiiiioooouuuunc----------"
  for (var i = 0, l = source.length; i < l; i++) {
      s = s.replace(new RegExp(source.charAt(i), 'g'), destination.charAt(i))
  }

  return s.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')
}