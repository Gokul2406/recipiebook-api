import "reflect-metadata";
import {createConnection} from "typeorm";
import path from "path"
import argon2 from "argon2"
import express, {Request, Response} from "express"
import { Users } from "./entity/User";
require("dotenv").config()
const bodyParser = require("body-parser")
import cors from "cors"
const main = async() => {
    const app = express()
    app.use(cors())
    app.use(bodyParser())
    createConnection().then(() => {
        console.log("Everything okay with orm")
    })
    app.get('/', (req: Request, res: Response) => {
        res.send("Hello")
    })

    app.get('/api/users/all', async(req: Request, res: Response) => {
        const users = await Users.find()
        console.log(users)
        res.send("Hello")
    })

    app.post('/api/users/create', async(req: Request, res: Response) => {
      const { username, password, email } = req.body.data
      console.log(username, password, email)
      const hashedPassword = await argon2.hash(password)
      const user = await Users.create({username: username, password: hashedPassword, email: email}).save()
      if (user) {
        res.json(true)
        console.log(user)
      } else {
        res.json(false)
      }
    })
    app.get('/api/users/create', async(req: Request, res: Response) => {
       res.send("create user")
    })
    app.listen(process.env.EXPRESS_PORT, () => console.log("Server started at port 4000"))
}
main()
