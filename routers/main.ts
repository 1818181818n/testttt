import { Client } from "discord.js";
import login from "./components/login";
import logout from "./components/logout";
import passport from "./components/passport";

export default async (
  app: import("express").Application,
  functionName: "login" | "passport" | "logout" | "super",
  functionOptions?: { client?: Client }
) => {
  if (functionName == "login") login(app);
  else if (functionName == "passport")
    passport(app, functionOptions?.client ? functionOptions.client : null);
  else if (functionName == "logout") logout(app);
  else if (functionName == "super") {
    await login(app);
    await passport(
      app,
      functionOptions?.client ? functionOptions.client : null
    );
    await logout(app);
  }
};
