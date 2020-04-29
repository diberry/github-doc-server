require('dotenv').config()
const path = require("path")

const SERVER_CONFIG = {
    GITHUB_CLIENT_ID:process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET:process.env.GITHUB_CLIENT_SECRET,
    API_SERVER_PORT:process.env.API_SERVER_PORT,
    UI_PORT:process.env.UI_PORT,
    SESSION_SETTINGS:{
        SECRET: process.env.SESSION_SECRET,
        FILE_SESSION: {
            PATH:path.join(__dirname, "sessions")
        }
    },
    ENVIRONMENT: process.env.ENVIRONMENT || 'production',
    AZURE:{
        APPLICATION_INSIGHTS_INSTRUMENTATION_KEY: process.env.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY
    }
}

const CLIENT_CONFIG = {
    API_SERVER_PORT:SERVER_CONFIG.API_SERVER_PORT,
    UI_PORT:SERVER_CONFIG.UI_PORT,
    AZURE:{
        APPLICATION_INSIGHTS_INSTRUMENTATION_KEY: SERVER_CONFIG.AZURE.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY
    }
}

module.exports = {
    SERVER_CONFIG,
    CLIENT_CONFIG
}