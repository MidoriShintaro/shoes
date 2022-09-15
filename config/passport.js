const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const facebookClientId = process.env.FB_KEY;
const facebookClientSecret = process.env.FB_SECRET;
const callbackURLFB = process.env.CBFB;
const googleClientId = process.env.GG_KEY;
const googleClientSecret = process.env.GG_SECRET;
const callbackURLGG = process.env.CBGG;
const User = require("../model/userModel");

module.exports = (passport) => {
  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => done(null, user));
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: facebookClientId,
        clientSecret: facebookClientSecret,
        callbackURL: callbackURLFB,
      },
      async function (accessToken, refreshToken, profile, done) {
        const currentUser = await User.findOne({ facebookId: profile.id });
        if (currentUser) {
          return done(null, currentUser);
        } else {
          const newUser = await new User({
            facebookId: profile.id,
            name: profile.displayName,
          }).save();
          return done(null, newUser);
        }
      }
    )
  );
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: callbackURLGG,
      },
      async (accessToken, refreshToken, profile, done) => {
        const curUser = await User.findOne({ googleId: profile.id });
        if (curUser) {
          return done(null, curUser);
        } else {
          const newUser = await new User({
            googleId: profile.id,
            name: profile.name.familyName + " " + profile.name.givenName,
            email: profile.emails[0].value,
          }).save();
          return done(null, newUser);
        }
      }
    )
  );
};
