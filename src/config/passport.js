const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, cb) => {
            const { id: googleId, displayName, name: { givenName: firstName, familyName: lastName } } = profile;
            const image = profile.photos[0].value;
            const newUser = { googleId, displayName, lastName, firstName, image };
            try {
                let user = await User.findOne({ googleId });
                console.log(user);
                if (user) {
                    cb(null, user);
                } else {
                    user = await User.create(newUser);
                    cb(null, user);
                }
            } catch (error) {
                console.log(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}
