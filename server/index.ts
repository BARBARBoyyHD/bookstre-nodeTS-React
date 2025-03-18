import session from "express-session";
import passport from "./src/middleware/Oauth2";
import express, { Request, Response, NextFunction } from "express";
import bookListRoutes from "./src/routes/GET/bookListRoutes";
import Login from "./src/routes/USER/Login/UserLoginRoutes";
import Register from "./src/routes/USER/Register/RegisterUserController";
import PostBookRoutes from "./src/routes/POST/PostBookRoutes";
import DeleteBookRoutes from "./src/routes/DELETE/DeleteBookRoutes"


const app = express();

const port: number = 5000;
app.use(
  session({
    secret: "CATS",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  req.user ? next() : res.sendStatus(401);
};

app.get("/", (req, res) => {
  res.send(
    "<a href='/api/login'>Login with google</a> <a href='/api/register'>Register with google</a>"
  );
});
// login
app.get("/api/login", Login);

// register
app.get("/api/register", Register);

app.get(
  "/google/login/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("login", (error: any, user: any, info: any) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        // ✅ Extract accessToken from `info`
        const accessToken = info?.accessToken;

        if (!accessToken) {
          return res.status(500).json({ message: "Access Token not found" });
        }

        res.cookie("accessToken", accessToken, {
          httpOnly: true, // Prevent access via JavaScript
          secure: process.env.NODE_ENV === "production", // HTTPS in production
          sameSite: "strict", // CSRF protection
          maxAge: 15 * 60 * 1000, // 15-minute expiry
        });

        return res.json({ user, accessToken }); // ✅ Send both user and token
      });
    })(req, res, next);
  }
);

app.get("/google/register/callback", (req, res, next) => {
  passport.authenticate(
    "register",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        console.error("Authentication Error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ message: "Authentication failed", info });
      }

      // Sanitize user data before sending response
      const sanitizedUser = {
        user_id: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
      };

      return res.json(sanitizedUser);
    }
  )(req, res, next);
});

app.get("/api/book/list", isLoggedIn, bookListRoutes);
app.post("/api/post/book", PostBookRoutes);
app.delete("/api/delete/book/:id",DeleteBookRoutes)

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
