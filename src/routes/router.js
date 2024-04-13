import Router from "express";
import {
  createShortUrl,
  getUrls,
  getUrl,
  updateUrl,
  deleteUrl,
  deleteSelected,
  redirectOriginalUrl,
} from "../controllers/urlController.js";
import {
  callback,
  logout,
  loginSuccess,
  loginFailure,
  deleteAccount,
} from "../controllers/authController.js";
import { guestCreateShortUrl } from "../controllers/guestController.js";
import { validateSchema } from "../middlewares/validatorMiddleware.js";
import { urlSchema } from "../schemas/urlSchema.js";
import ensureAuthenticated from "../middlewares/authenticatedMiddleware.js";
import passport from "../passport/passport.js";

// Initialize Express
const router = Router();

// Routes
router.get("/", (req, res) => {
  res.send("Welcome to the URL Shortener API!");
});

// Routes for guest users
router.post("/guest/shorten", validateSchema(urlSchema), guestCreateShortUrl); // Create

// Routes for Auth0
router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile",
  })
); // Auth0 login
router.get(
  "/callback",
  passport.authenticate("auth0", {
    failureRedirect: "/login/failure",
  }),
  callback
); // Auth0 callback
router.get("/logout", logout); // Auth0 logout
router.get("/login/success", ensureAuthenticated, loginSuccess); // Auth0 login success
router.get("/login/failure", loginFailure); // Auth0 login failure
router.delete("/delete/account", ensureAuthenticated, deleteAccount); // Delete account

// Routes for URL Shortener
router.post(
  "/shorten",
  ensureAuthenticated,
  validateSchema(urlSchema),
  createShortUrl
); // Create
router.get("/urls", ensureAuthenticated, getUrls); // Read all
router.get("/url/:id", ensureAuthenticated, getUrl); // Read
router.put(
  "/update/:id",
  ensureAuthenticated,
  validateSchema(urlSchema),
  updateUrl
); // Update
router.delete("/delete/:id", ensureAuthenticated, deleteUrl); // Delete
router.delete("/deleteSelected", ensureAuthenticated, deleteSelected); // Delete selected
router.get("/:shortUrlId", redirectOriginalUrl); // Redirect

export default router;
