import { useState, useEffect } from "react"
import { Sections } from "./constants"

var WPAPI = require("wpapi")
var wp = new WPAPI({ endpoint: "https://stanforddaily.com/wp-json" })

export const useWordPress = (pageNumber = 1) => {
    const [data, setData] = useState({})
    const [articles, setArticles] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
  
    useEffect(() => {
      // Set initial loading state.
      setLoading(true)
  
      if (pageNumber === 1) {
        Object.values(Sections).forEach(async category => {
          try {
            const response = await wp.posts().categories(category.id).perPage(6).page(pageNumber).get()
            setData((prevState) => ({
              ...prevState,
              [category.slug]: [...(category.slug in prevState ? prevState[category.slug] : []), ...response]
            }))

            if (articles?.culture?.length < 4 && category.slug === Sections.ARTS_LIFE.slug || category.slug === Sections.THE_GRIND.slug) {
              setArticles((prevState) => ({
                ...prevState,
                culture: [...(prevState?.culture ?? []), ...response]
              }))
            }
            
            if (pageNumber === 1) {
              setArticles((prevState) => ({
                ...prevState,
                [category.slug]: response.filter(item => !item.categories.includes(Sections.FEATURED.id) || category.slug === Sections.FEATURED.slug)
              }))
            }
          } catch (error) {
            setError(error)
          } finally {
            setLoading(false)
          }
        })
      } else {
        try {
          wp.posts().perPage(12).page(pageNumber).get().then(posts => {
            setData((prevState) => ({
              ...prevState,
              wildcard: [...(prevState?.wildcard ?? []), ...posts.filter(post => {
                return !Object.keys(articles).some(category => articles[category].some(item => item.id === post.id))
              })]
            }))
          })
        } catch (error) {
          setError(error)
        } finally {
          setLoading(false)
        }
      } 
    }, [pageNumber])
    
    return { data, articles, loading, error }
}

export default wp