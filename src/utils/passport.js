const { Strategy } = require('passport-discord');
const passport = require('passport');

let { web: {domain_with_protocol}, discord_client: {id, secret} } = require("@root/config.json");
secret = process.env.SECRET;

var scopes = ['identify'];
 
passport.use(new Strategy({
    clientID: id,
    clientSecret: secret,
    callbackURL: `${domain_with_protocol}/api/callback`,
    scope: scopes
},
function(accessToken, refreshToken, profile, cb) {
    return cb("", profile);
}))

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
