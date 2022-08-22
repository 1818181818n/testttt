import express from "express";
import db from "quick.db";
import fs from "fs";

const app = express();
import discord from "discord.js";
import main from "./routers/main";
import routes from "./routers/routes/routes";
const client = new discord.Client({
  intents: new discord.Intents(32767),
});

(async () => {
  let config = JSON.parse(
    await fs.readFileSync(process.cwd() + "/config.def", { encoding: "utf-8" })
  );
  await client.login(config.bot.token);
  await main(app, "super", { client });
  await routes(app);
  //   app.get("/thanks", (req, res) => {
  //     res.render("thanks", {
  //       title: "Thanks",
  //       client: client,
  //       req: req,
  //       user: req.isAuthenticated() ? req.user : null,
  //     });
  //   });

  //   app.get("/dashboard", (req, res) => {
  //     res.render("servers", {
  //       title: "Servers",
  //       client: client,
  //       req: req,
  //       user: req.isAuthenticated() ? req.user : null,
  //       permissions: discord.Permissions,
  //       domain: config.website.domain,
  //     });
  //   });

  //   app.get("/dashboard/:guildId", async (req: any, res) => {
  //     let guildId = req.params.guildId;
  //     if (!guildId) return res.redirect("/");
  //     let guild = client.guilds.cache.find((g) => g.id == guildId);
  //     if (!guild) return res.redirect("/");
  //     let userGG = req.user;
  //     if (!userGG) return res.redirect("/");
  //     let user: any = guild.members.cache.find((u) => u.id == req.user.id);
  //     if (!user) {
  //       user = await guild.members.fetch(req.user?.id).then((u) => {
  //         if (!u) return res.redirect("/");
  //       });
  //     }
  //     if (!user.permissions.has(discord.Permissions.FLAGS.ADMINISTRATOR))
  //       return res.redirect("/");
  //     res.render("server", {
  //       title: guild.name,
  //       client: client,
  //       req: req,
  //       user: req.isAuthenticated() ? req.user : null,
  //       guild: guild,
  //     });
  //   });

    app.post("/dashboard/:guildId", async (req: any, res) => {
      let guildId = req.params.guildId;
      if (!guildId) return res.redirect("/");
      let guild = client.guilds.cache.find((g) => g.id == guildId);
      if (!guild) return res.redirect("/");
      let userGG = req.user;
      if (!userGG) return res.redirect("/");
      let user: any = guild.members.cache.find((u) => u.id == req.user?.id);
      if (!user) {
        user = await guild.members.fetch(req.user?.id).then((u) => {
          if (!u) return res.redirect("/");
        });
      }
      if (!user.permissions.has(discord.Permissions.FLAGS.ADMINISTRATOR))
        return res.redirect("/");
      let body = req.body;
      if (body?.language) {
        let language = body.language;
        db.set(`Lang_${guildId}`, language);
      } else if (body?.prefix) {
        let prefix = body.prefix;
        db.set(`Prefix_${guildId}`, prefix);
      }
      res.render("server", {
        title: guild.name,
        client: client,
        req: req,
        user: req.isAuthenticated() ? req.user : null,
        guild: guild,
      });
    });

  app.use(express.static(`${__dirname}/assets`));
  app.locals.basedir = `${__dirname}/assets`;

  app.listen(process.env.PORT || config.website.port, () =>
    console.log("dashboard in load..")
  );
})();

export default client;
