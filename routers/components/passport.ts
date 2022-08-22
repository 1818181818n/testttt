import passport from "passport";
import express from "express";
import bodyparser from "body-parser";
import StrategyF from "passport-discord";
import session from "express-session";
import memorystoreF from "memorystore";
import fs from "fs";
const memorystore = memorystoreF(session);
const Strategy = StrategyF.Strategy;

export default async (
  app: import("express").Application,
  client: import("discord.js").Client | null
) => {
  let config = JSON.parse(
    await fs.readFileSync(process.cwd() + "/config.def", { encoding: "utf-8" })
  );
  await passport.serializeUser((user, done) => done(null, user));
  await passport.deserializeUser((obj: any, done) => done(null, obj));
  await passport.use(
    new Strategy(
      {
        clientID: client?.user?.id || config.bot.id,
        clientSecret: config.bot.secret,
        callbackURL: config.website.callback,
        scope: ["identify", "guilds", "guilds.join"],
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile));
      }
    )
  );

  let store: any = new memorystore({ checkPeriod: 86400000 });

  app.use(
    session({
      store: store,
      secret: `!@#$d8932%^ni#(!@bn9312)`,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.set("views", process.cwd() + "/src/views");
  app.set("view engine", "pug");

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(bodyparser.json());
  app.use(
    bodyparser.urlencoded({
      extended: true,
    })
  );

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
};
