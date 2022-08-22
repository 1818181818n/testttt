import client from "../../..";
import db from "quick.db";
import axios from "axios";
import tokens from "../../../../tokens";

export default (app: import("express").Application) => {
  app.post("/profile/:userId/bots/create/:botId", async (req, res) => {
    if (!req.isAuthenticated()) return res.send({ error: "un authenticated" });
    let userId = req.params.userId;
    let botId = req.params.botId;
    if (!userId) return res.send({ error: "no userId found" });
    let user = client.users.cache.find((u) => u.id == userId);
    let defUser: any = req.user;
    if (!user) return res.send({ error: "no user found" });
    if (user.id !== defUser.id)
      return res.send({ error: "can't acess this user" });
    let body = req.body;
    if (body.name == "" || body.bio == "" || body.avatar == "") {
      res.send({
        error: "please insert all the data, to confirm the process.",
      });
      return;
    }
    async function getToken(tokens: any[]) {
      let num = Math.floor(Math.random() * tokens.length);
      return tokens[num];
    }
    async function getData() {
      const req = await axios.post(
        "https://discord.com/api/v9/applications",
        {
          name: body.name,
          description: body.bio,
          icon: body.avatar,
        },
        {
          headers: {
            Authorization: await getToken(tokens),
          },
        }
      );
      const data = req.data;
      return data;
    }

    if ((await db.get(`TOKENS_${user.id}`)) == null)
      await db.set(`TOKENS_${user.id}`, []);
    await db.push(`TOKENS_${user.id}`, await getData());
    if (botId == "token.def") {
      res.render("creator", {
        title: "Create - " + botId,
        pass: "Token",
        client: client,
        req: req,
        user: user,
        db: db,
        bot: botId,
        data: await db.get(`TOKENS_${user.id}`),
      });
    } else {
      res.render("creator", {
        title: "Create - " + botId,
        pass: "Bot",
        client: client,
        req: req,
        user: user,
        db: db,
        bot: botId,
        data: await db.get(`TOKENS_${user.id}`),
      });
    }
  });

  app.get("/profile/:userId/bots/create/:botId", (req, res) => {
    if (!req.isAuthenticated()) return res.send({ error: "un authenticated" });
    let userId = req.params.userId;
    let botId = req.params.botId;
    if (!userId) return res.send({ error: "no userId foun" });
    let user = client.users.cache.find((u) => u.id == userId);
    let defUser: any = req.user;
    if (!user) return res.send({ error: "no user found" });
    if (user.id !== defUser.id)
      return res.send({ error: "can't acess this user" });
    if (botId == "token.def") {
      res.render("creator", {
        title: "Create - " + botId,
        pass: "Token",
        client: client,
        req: req,
        user: user,
        db: db,
        bot: botId,
        data: null,
      });
    } else {
      res.render("creator", {
        title: "Create - " + botId,
        pass: "Bot",
        client: client,
        req: req,
        user: user,
        db: db,
        bot: botId,
        data: null,
      });
    }
  });

  app.get("/profile/:userId/tokens", async (req, res) => {
    if (!req.isAuthenticated()) return res.send({ error: "un authenticated" });
    let userId = req.params.userId;
    if (!userId) return res.send({ error: "no userId foun" });
    let user = client.users.cache.find((u) => u.id == userId);
    let defUser: any = req.user;
    if (!user) return res.send({ error: "no user found" });
    if (user.id !== defUser.id)
      return res.send({ error: "can't acess this user" });
    let data = await db.get(`TOKENS_${user.id}`);
    res.render("tokens", {
      title: "Tokens - " + user.username,
      pass: "Bot",
      client: client,
      req: req,
      user: user,
      db: db,
      data: data,
    });
  });

  app.get("/profile/:userId/bots/create", (req, res) => {
    if (!req.isAuthenticated()) return res.send({ error: "un authenticated" });
    let userId = req.params.userId;
    if (!userId) return res.send({ error: "no userId foun" });
    let user = client.users.cache.find((u) => u.id == userId);
    let defUser: any = req.user;
    if (!user) return res.send({ error: "no user found" });
    if (user.id !== defUser.id)
      return res.send({ error: "can't acess this user" });
    res.send({ error: "no bot_id found" });
  });

  app.get("/profile/:userId/bots", (req, res) => {
    if (!req.isAuthenticated()) return res.send({ error: "un authenticated" });
    let userId = req.params.userId;
    if (!userId) return res.send({ error: "no userId foun" });
    let user = client.users.cache.find((u) => u.id == userId);
    let defUser: any = req.user;
    if (!user) return res.send({ error: "no user found" });
    if (user.id !== defUser.id)
      return res.send({ error: "can't acess this user" });
    res.render("bots", {
      title: "Bots - " + user.username,
      client: client,
      req: req,
      user: user,
      db: db,
      bots: [
        {
          name: "token",
          price: "Free",
          version: "-------------------------",
          path: "token.def",
        },
        {
          name: "music",
          price: "100k",
          version: "simple -------------",
          path: "music-1.def",
        },
        {
          name: "music",
          price: "300k",
          version: "advanced --------",
          path: "music-2.def",
        },
        {
          name: "music",
          price: "500k",
          version: "more advanced",
          path: "music-3.def",
        },
      ],
    });
  });

  app.get("/profile/:userId", (req, res) => {
    if (!req.isAuthenticated()) return res.send({ error: "un authenticated" });
    let userId = req.params.userId;
    if (!userId) return res.send({ error: "no userId foun" });
    let user = client.users.cache.find((u) => u.id == userId);
    let defUser: any = req.user;
    if (!user) return res.send({ error: "no user found" });
    if (user.id !== defUser.id)
      return res.send({ error: "can't acess this user" });
    res.render("profile", {
      title: "Profile - " + user.username,
      client: client,
      req: req,
      user: user,
    });
  });

  app.get("/profile", (req, res) => {
    if (!req.isAuthenticated()) res.redirect("/");
    else res.send({ error: "no user_id foun" });
  });

  app.get("/", (req, res) => {
    res.render("index", {
      title: "Home",
      client: client,
      req: req,
      user: req.isAuthenticated() ? req.user : null,
    });
  });
};
