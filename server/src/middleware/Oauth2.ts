import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Login } from "../controllers/USER/Login/LoginUserControllers";
import type { Users } from "../types/users";

const CLIENT_ID: string = process.env.CLIENT_ID || "";
const CLIENT_SECRET: string = process.env.CLIENT_SECRET || "";
const GOOGLE_CALLBACK_LOGIN: string = process.env.GOOGLE_CALLBACK_LOGIN || "";

passport.use(
  "login",
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_LOGIN,
      scope: ["profile", "email"],
      passReqToCallback: true, // ✅ Enable request access
    },
    async (req, accessToken, refreshToken, profile: any, done) => {
      try {
        const user = await Login(profile._json);

        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        if (!user) {
          console.log("Login Failed:", user);
          return done(null, false);
        }

        console.log("User login success!");
        return done(null, user, { accessToken }); // ✅ Pass accessToken as third parameter
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user (store user ID in session)
passport.serializeUser((user: any, done) => {
  done(null, user);
});

// Deserialize user (retrieve user from session)
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export default passport;
