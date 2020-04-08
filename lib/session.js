var session = require('express-session');
var FileStore = require('session-file-store')(session);

module.exports.createSessionMiddleWare = (sessionConfiguration,) =>{
    return session({
        store: new FileStore(sessionConfiguration.FILE_SESSION.PATH),
        secret: sessionConfiguration.SECRET,
        saveUninitialized: true,
        resave: true,
        cookie: {
          secure: false,
          maxAge: 2160000000,
          httpOnly: false
      }
    });
}
module.exports.get = (req, key) =>{
  return req.session[key];
}
module.exports.set = async (req, key, value) =>{
  req.session[key] = value;
  await req.session.save();
}