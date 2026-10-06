import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function mountStaticFrontend(app, buildDirectory = fileURLToPath(new URL("../../dist", import.meta.url))) {
  if (!existsSync(path.join(buildDirectory, "index.html"))) return false;

  app.use(express.static(buildDirectory, { index: false }));
  app.get("/{*path}", (_request, response, next) => {
    response.sendFile(path.join(buildDirectory, "index.html"), (error) => {
      if (error) next(error);
    });
  });
  return true;
}
