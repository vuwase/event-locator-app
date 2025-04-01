const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const db = require("../models");

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new Strategy(opts, async (jwt_payload, done) => {
    try {
        const user = await db.User.findByPk(jwt_payload.id);
        return done(null, user || false);
    } catch (err) {
        return done(err, false);
    }
}));

// No need to export anything unless you're exporting a specific function
