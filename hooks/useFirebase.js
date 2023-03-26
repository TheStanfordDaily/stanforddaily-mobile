import { useEffect, useState } from "react"
import { validateConfig } from "../utils/format"
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"

export const useFirebase = (config) => {
    const [firebase, setFirebase] = useState({})
    useEffect(() => {
        if (validateConfig(config)) {
            const app = initializeApp(config)
            setFirebase({ app, auth: getAuth(app), db: getDatabase(app) })
        } else {
            console.error("Invalid Firebase configuration.")
        }
    }, [])

    return firebase
}