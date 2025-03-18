import { Router } from "express";
import passport from "../../../middleware/Oauth2";
const route = Router();

route.get(
  "/api/login",
  passport.authenticate('login', { scope: ["email", "profile"] })
);

export default route;
