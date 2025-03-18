import { Router } from "express";
import passport from "../../../middleware/RegisterOauth";
const route = Router();

route.get(
  "/api/register",
  passport.authenticate('register', { scope: ["email", "profile"] })
);

export default route;