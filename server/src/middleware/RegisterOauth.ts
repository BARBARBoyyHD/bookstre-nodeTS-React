import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { register } from "../controllers/USER/Register/registerUserControllers";

const CLIENT_ID: string = process.env.CLIENT_ID || "";
const CLIENT_SECRET: string = process.env.CLIENT_SECRET || "";
const GOOGLE_CALLBACK_REGISTER: string =
  process.env.GOOGLE_CALLBACK_REGISTER || "";

passport.use(
  "register",
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_REGISTER,
    },
    async (accessToken: string, refreshToken: string, profile: any, done) => {
      try {
        const user = await register(profile._json);

        if (!user) {
          console.log("Registration Failed");
          return done(null, false);
        }

        console.log("user registered : ", profile._json);
        return done(null, profile._json);
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
