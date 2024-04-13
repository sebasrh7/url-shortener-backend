import passport from "../passport/passport.js";
const ensureAuthenticated = passport.authenticate("jwt", { session: false });

export default ensureAuthenticated;
