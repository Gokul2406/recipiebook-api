import "reflect-metadata";
import jwt from "jsonwebtoken"
import { createConnection } from "typeorm";
import argon2 from "argon2";
import express, { Request, Response } from "express";
import { Users } from "./entity/User";
import Post from "./entity/Post";
require("dotenv").config();
const bodyParser = require("body-parser");
import cors from "cors";
const main = async () => {
  const app = express();
  app.use(cors({origin: "http://localhost:3000"}));
  app.use(bodyParser());
  app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

  await createConnection().then(() => console.log("Started ORM"))
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
    const accessToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY)
    console.log(accessToken)
    if (user) {
     res.json({ success: true, accessToken: accessToken});
    } else {
      res.json(false);
    }
  });
	
  app.post('/api/feed', async(req: Request, res: Response) => {
	if ('token' in req.body.data) {
		const { token } = req.body.data
		const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
		console.log(verified)
		if (verified) {
			res.send("feed")
		} else {
			res.sendStatus(401)
		}
	} else {
		res.sendStatus(403)
	}

  })

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
