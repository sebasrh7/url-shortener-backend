import passport from "passport";
import Auth0Strategy from "passport-auth0";
import JwtStrategy from "passport-jwt";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

// JWT extraction
const jwtExtractor = (req) => {
  let token = null;
  if (req && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  return token;
};

// JWT strategy
const jwtStrategy = new JwtStrategy.Strategy(
  {
    jwtFromRequest: jwtExtractor,
    secretOrKey: process.env.JWT_SECRET,
  },
  async (jwt_payload, done) => {
    try {
      const user = await User.findById({ _id: jwt_payload._id });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }
);
passport.use(jwtStrategy);

// Passport configuration
const auth0Strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL, // This is the route Auth0 will redirect to after the user logs in
  },
  async (accessToken, refreshToken, extraParams, profile, done) => {
    try {
      const user = await User.findOne({ auth0Id: profile.id });
      if (!user) {
        const newUser = new User({
          auth0Id: profile.id,
          displayName: profile.displayName,
          nickname: profile.nickname,
          emails: profile.emails,
          picture: profile.picture,
          provider: profile.provider,
          date: new Date(),
        });
        await newUser.save();

        return done(null, newUser);
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
);
passport.use(auth0Strategy);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log("Error deserializing user", error);
    done(error, null);
  }
});

export default passport;