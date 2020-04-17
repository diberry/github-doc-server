const Authentication = require('./authentication');
const GitHub = require('./github');
const Meta = require('./meta');
const User = require('./user');

module.exports = {
    Routes: {
        Authentication: Authentication.router,
        GitHub:GitHub,
        Meta: Meta.router,
        User: User
    },
    isAuthenticated: Authentication.isAuthenticated
}