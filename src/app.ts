import * as SQL from 'sequelize-typescript'
import * as express from 'express'
import { join } from 'path'
import * as bodyParser from 'body-parser'
import * as Sensitive from './sensitive'
import { router as router1 } from './routers/v1'

export interface MyRequest extends express.Request {
    db: SQL.Sequelize
}

export interface myError extends Error {
    statusCode?: number
}

export class Api {
    db: SQL.Sequelize
    port: number
    express: express.Express

    constructor(port: number) {
        this.port = port
        this.express = express()

        this.db = new SQL.Sequelize({
            name: process.env.POSTGRES_DATABASE|| Sensitive.POSTGRES_DATABASE || "",
            username: process.env.POSTGRES_USERNAME|| Sensitive.POSTGRES_USERNAME || "",
            password: process.env.POSTGRES_PASSWORD|| Sensitive.POSTGRES_PASSWORD || "",
            modelPaths: [join(__dirname, 'models')],
            host: process.env.POSTGRES_HOST || Sensitive.POSTGRES_HOST ||"",
            dialect: "postgres",
            logging: false
        })
    }

    public async start() {
        this.express.disable('etag')
        this.express.disable('server')
        this.express.disable('x-powered-by')
        if (this.express.get('env') === 'production') { this.express.set('trust proxy', true) }

        ////////////////
        //  JSON BODY //
        ////////////////
        this.express.use(bodyParser.json())
        this.express.use(bodyParser.urlencoded({ extended: false }))

        this.express.use((req, res, next) => {
            req.get('Origin') && res.set('Access-Control-Allow-Origin', req.get('Origin'))
            res.set('Access-Control-Allow-Credentials', 'true')
            res.set('Access-Control-Allow-Headers', 'Content-Type')
            return next()
        })

        this.express.use((req: MyRequest, res, next) => {
            req.db = this.db
            return next()
        })

        this.express.use("/v1", router1)

        //////////////////
        //  404 handler //
        //////////////////
        this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            return res.status(404).json({
                error: true,
                message: 'route not found'
            })
        })
        this.express.use((err: myError, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.statusCode || 500)
            res.json({
                name: err.name,
                message: err.message,
                stack: (this.express.get('env') !== 'production') ? err.stack : {}
            })
        })
        try {
            await this.db.authenticate()
            await this.db.sync({ force: false })
        } catch (err) {
            console.error(err)
            process.exit(1)
        }

        this.express.listen(this.port, () => {
            console.info("Registro Elettronico server listening on port " + this.port)
        })

    }
}