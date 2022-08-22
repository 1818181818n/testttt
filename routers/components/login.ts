import url from "url";
import passport from "passport";

export default (app: import("express").Application) => {
  app.get(
    "/login",
    (req:any, res, next) => {
      if (req.session?.backURL) {
        req.session.backURL = req.session?.backURL;
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname == app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
      }
      next();
    },
    passport.authenticate("discord", { prompt: "none" })
  );
};
