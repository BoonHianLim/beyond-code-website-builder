import dotenv from "dotenv";

import express from "express";
import cors from "cors";

import * as routes from "./routes";

dotenv.config();

const port = process.env.SERVER_PORT || "8080";
const app = express();

app.use(express.json());

// Allow CORS for localhost
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's URL if needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies or Authorization headers
};

app.use(cors(corsOptions));

// Configure routes
routes.register(app);

// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
