const Authentication = require('./authentication');
const GitHub = require('./github');
const Meta = require('./meta');
const User = require('./user');
const Config = require('./config');

module.exports = {
    Routes: {
        Authentication: Authentication.router,
        GitHub:GitHub,
        Meta: Meta.router,
        User: User,
        ClientConfig: Config
    },
    isAuthenticated: Authentication.isAuthenticated
}