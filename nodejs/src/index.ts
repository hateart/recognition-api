import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname+'/.env' });
import express, { Application } from "express";
import Router from "./routes";

//console.log(__dirname+'/.env' );
//console.log(process.env.S3_SECRET_KEY);

const PORT = process.env.PORT || 8080;

const app: Application = express();

app.use(express.json());

app.use(Router);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});