const session = require('../lib/session.js')

module.exports = (req, res, next) => {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    const user = session.get(req, "user")
    if (user && user.gitHubToken && user.gitHubToken.length > 0)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE

    res.redirect('/login');
}