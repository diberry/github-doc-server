require('dotenv').config()

module.exports = {
    GITHUB_CLIENT_ID:process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET:process.env.GITHUB_CLIENT_SECRET,
    API_SERVER_PORT:process.env.API_SERVER_PORT,
    UI_PORT:process.env.UI_PORT
}