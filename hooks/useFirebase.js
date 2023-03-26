import { useEffect, useState } from "react"
import { validateConfig } from "../utils/format"
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"

export const useFirebase = (config) => {
    const [error, setError] = useState(null)
    const [app, setApp] = useState(null)
    useEffect(() => {
        if (validateConfig(config)) {
            setApp(initializeApp(config))
        } else {
            console.error("Invalid Firebase configuration.")
            setError("Invalid Firebase configuration.")
        }
    }, [config])
    
    return app && { app, auth: getAuth(app), db: getDatabase(app), error }
}