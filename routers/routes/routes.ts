import callback from "./functions/callback";
import views from "./pages/views";

export default async (app: import("express").Application) => {
  await views(app);
  await callback(app);
};
