import { useState, useEffect } from "react"
import { Sections } from "./constants"

var WPAPI = require("wpapi")
var wp = new WPAPI({ endpoint: "https://stanforddaily.com/wp-json" })

export const useWordPress = (pageNumber) => {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
  
    useEffect(() => {
      const categories = [Sections.FEATURED, Sections.NEWS, Sections.OPINIONS, Sections.SPORTS]
  
      // Set initial loading state
      setLoading(true)
  
      categories.forEach(async category => {
        try {
          const response = await wp.posts().perPage(4).page(pageNumber).categories(category.id).get()
  
          // Update the state as soon as data is available
          setData((prevState) => ({
            ...prevState,
            [category.slug]: response,
          }));
        } catch (error) {
          setError(error)
        } finally {
          setLoading(false)
        }
      })
    }, [])
  
    return { data, loading, error }
}

export default wp