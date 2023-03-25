import { useState, useEffect } from "react"
import { Sections } from "../utils/constants"
import Model from "../utils/model"
import _ from "lodash"

const BATCH_SIZE = 12

export const useWordPress = (pageNumber = 1) => {
    const [data, setData] = useState({})
    const [articles, setArticles] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
  
    useEffect(() => {
      // Set initial loading state.
      setLoading(true)
  
      Object.values(Sections).forEach(async category => {
        try {
          const response = await Model.posts().categories(category.id).perPage(6).page(pageNumber).get()
          setData((prevState) => ({
            ...prevState,
            [category.slug]: [...(category.slug in prevState ? prevState[category.slug] : []), ...response]
          }))
          
          if (pageNumber === 1) {
            setArticles((prevState) => ({
              ...prevState,
              [category.slug]: response.filter(item => !item.categories.includes(Sections.FEATURED.id) || category.slug === Sections.FEATURED.slug)
            }))

            if (category.slug === Sections.ARTS_LIFE.slug || category.slug === Sections.THE_GRIND.slug) {
              setArticles((prevState) => ({
                ...prevState,
                culture: [...(prevState?.culture ?? []), ..._.shuffle(response)]
              }))
            }
          }
        } catch (error) {
          setError(error)
        } finally {
          setLoading(false)
        }
      })

      Model.posts().perPage(Object.keys(articles)?.length ?? BATCH_SIZE).page(pageNumber + 1).get().then(posts => {
        setData((prevState) => ({
          ...prevState,
          wildcard: [
            ...(prevState?.wildcard ?? []),
            ...posts.filter(post => !Object.keys(articles).some(category => articles[category].some(item => item.id === post.id)))
          ]
        }))
      })
    }, [pageNumber])
    
    return { data, articles, loading, error }
}