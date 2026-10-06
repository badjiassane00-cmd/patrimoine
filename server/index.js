import "dotenv/config";
import { createApp } from "./app.js";

const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "0.0.0.0";
const app = createApp();
const server = app.listen(port, host, () => {
  console.log(`Téranga backend listening on http://${host}:${port}`);
});

server.on("error", (error) => {
  console.error("Impossible de démarrer le serveur HTTP :", error.message);
  process.exitCode = 1;
});

void app.locals.ready.catch((error) => {
  console.error("Échec de préparation de la base de données :", error.message);
});
