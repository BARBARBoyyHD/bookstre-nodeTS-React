import session from "express-session";
import passport from "./src/middleware/Oauth2";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import bookListRoutes from "./src/routes/GET/bookListRoutes";
import Login from "./src/routes/USER/Login/UserLoginRoutes";
import Register from "./src/routes/USER/Register/RegisterUserController";
import PostBookRoutes from "./src/routes/POST/PostBookRoutes";
import DeleteBookRoutes from "./src/routes/DELETE/DeleteBookRoutes";
import GetSingleBookRoutes from "./src/routes/SINGLE/GetSingleBookRoutes";
import EditBookRoutes from "./src/routes/EDIT/EditBookRoutes";

const app = express();

const port: number = 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
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
        return res.send(`
          <html>
            <body style="text-align: center; font-family: Arial, sans-serif; padding: 50px;">
              <h2>Authentication Failed</h2>
              <p>You haven't registered yet.</p>
              <p>We will redirect you to register page.</p>
              <script>
                setTimeout(() => {
                  if (window.opener) {
                    window.opener.postMessage({ type: "LOGIN_FAILED" }, "*");
                  }
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `);
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
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });

        // ✅ Show "Thank you" message before closing the window
        return res.send(`
          <html>
            <body style="text-align: center; font-family: Arial, sans-serif; padding: 50px;">
              <h2>Login Successful!</h2>
              <p>You can now close this window.</p>
              <script>
                setTimeout(() => {
                  window.opener.postMessage(
                    { type: "LOGIN_SUCCESS", user: ${JSON.stringify(
                      user
                    )}, accessToken: "${accessToken}" }, 
                    "*"
                  );
                  window.close();
                }, 2000);
              </script>
            </body>
          </html>
        `);
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

      const sanitizedUser = {
        user_id: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
      };

      // ✅ Show "Thank you" message before closing the window
      return res.send(`
        <html>
          <body style="text-align: center; font-family: Arial, sans-serif; padding: 50px;">
            <h2>Thank you for registering!</h2>
            <p>You can now close this window.</p>
            <script>
              setTimeout(() => {
                window.opener.postMessage({type: "REGISTER_SUCCESS",user: ${JSON.stringify(
                  sanitizedUser
                )} }, "*");
                window.close();
              }, 2000);
            </script>
          </body>
        </html>
      `);
    }
  )(req, res, next);
});

app.get("/api/book/list", isLoggedIn, bookListRoutes);
app.post("/api/post/book", PostBookRoutes);
app.delete("/api/delete/book/:id", DeleteBookRoutes);
app.get("/api/single/book/:id", GetSingleBookRoutes);
app.put("/api/edit/book/:id", EditBookRoutes);

app.get("/api/auth/user", isLoggedIn, (req: Request, res: Response) => {
  res.json({
    message: "Authenticated",
    user: req.user,
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
