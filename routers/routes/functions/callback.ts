import passport from "passport";

export default (app: import("express").Application) => {
  app.get(
    "/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    async (req, res) => {
      res.redirect("/thanks");
    }
  );
};
