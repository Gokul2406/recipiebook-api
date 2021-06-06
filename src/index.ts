import "reflect-metadata";
import {createConnection} from "typeorm";
import path from "path"
import express, {Request, Response} from "express"
import { Users } from "./entity/User";
require("dotenv").config()
const bodyParser = require("body-parser")

const main = async() => {
    const app = express()
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
        res.json(req.body)
    })
    app.get('/api/users/create', async(req: Request, res: Response) => {
       res.send("create user") 
    })
    app.listen(process.env.EXPRESS_PORT, () => console.log("Server started at port 4000"))
}
main()