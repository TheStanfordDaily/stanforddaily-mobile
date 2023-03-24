import { useState, useEffect } from "react"
import { Sections } from "./constants"

var WPAPI = require("wpapi")
var wp = new WPAPI({ endpoint: "https://stanforddaily.com/wp-json" })

export const useWordPress = (pageNumber = 1) => {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
  
    useEffect(() => {
      console.log("new page")
      // Set initial loading state
      setLoading(true)
  
      Object.values(Sections).forEach(async category => {
        try {
          const response = await wp.posts().categories(category.id).perPage(4).page(pageNumber).get()
          // Featured is special and you'll need to pull those from the set of all posts and filter them out (whichever ones contain the featured category)
          // Update the state as soon as data is available
          console.log(category.slug, response)
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
    }, [pageNumber])
    
    return { data, loading, error }
}

export default wp