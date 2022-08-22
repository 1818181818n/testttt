export default (app: import("express").Application) => {
  app.get("/logout", (req, res) => {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/");
    });
  });
};
