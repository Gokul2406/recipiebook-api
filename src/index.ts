import "reflect-metadata";
import { createConnection } from "typeorm";
import path from "path";
import argon2 from "argon2";
import express, { Request, Response } from "express";
import { Users } from "./entity/User";
require("dotenv").config();
const bodyParser = require("body-parser");
import cors from "cors";
const main = async () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser());
  createConnection().then(() => {
    console.log("Everything okay with orm");
  });
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello");
  });

  app.get("/api/users/all", async (req: Request, res: Response) => {
    const users = await Users.find();
    console.log(users);
    res.send("Hello");
  });

  app.post("/api/users/create", async (req: Request, res: Response) => {
    const { username, password, email } = req.body.data;
    console.log(username, password, email);
    const hashedPassword = await argon2.hash(password);
    const user = await Users.create({
      username: username,
      password: hashedPassword,
      email: email,
    }).save();
    if (user) {
      if (req.session) {
        req.session.userId = user.id;
      }
      console.log(req.session)
     res.json({ success: true});
    } else {
      res.json(false);
    }
  });
	
  app.post('/api/users/login', async(req: Request, res: Response) => {
	  console.log(req.body)
	//const { username, password } = req.body.data
	const username = req.body.data.username;
	console.log(username)
	const password = req.body.data.psd	
	const user = await Users.findOneOrFail({username: username})
	if (!user) {
		res.send({err: true, errMsg: "No user with that username"})
	}
	const valid = await argon2.verify(user.password, password)
	if (!valid) {
		res.send({err: true, errMsg: "Invalid password"})
	}
	res.send({loggedIn: true, user: user.username})
  })

  app.get("/api/users/create", async (req: Request, res: Response) => {
    res.send("create user");
  });
  app.listen(process.env.EXPRESS_PORT, () =>
    console.log("Server started at port 4000")
  );
};
main();
