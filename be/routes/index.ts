import * as express from "express";

export const register = (app: express.Application) => {
  // home page
  app.get("/", (req: any, res) => {
    console.log("Home page requested");
  });

  // about page
  app.post("/generate-app", (req: any, res) => {
    console.log("About page requested");
    res.status(200).send("<html><body><h1>Generate App</h1></body></html>");
  });
};
