import * as express from 'express'
import { MyRequest } from '../app'

import LocalEvent from '../models/localEvent'
import RemoteEventInfo from '../models/remoteEventInfo'
import { IsArray } from 'sequelize-typescript/lib/annotations/validation/IsArray';
import { isArray, error } from 'util';
import { arch } from 'os';
import { ValidationError } from 'sequelize';

export let router = express.Router()

router.route("/user/:id/remote")
    .get(async (req: MyRequest, res: express.Response, next: express.NextFunction) => {
        return res.json(await RemoteEventInfo.findAll())
    })
    .post(async (req: MyRequest, res: express.Response, next: express.NextFunction) => {
        if (req.body.data === undefined) {
            return res.status(401).json('Provide "data"')
        }

        if (!isArray(req.body.data)) {
            return res.status(401).json('"data" needs to be an array')
        }

        let profile = Number.parseInt(req.params.id)

        let data: Array<RemoteEventInfo> = (req.body.data as Array<{
            profile: number | undefined
            id: number
            completed: boolean
            test: boolean
            archived: boolean
        }>).map(value => {
            value.profile = profile
            return new RemoteEventInfo(value)
        })

        try {
            await Promise.all(data.map(value => {
                return RemoteEventInfo.findOne<RemoteEventInfo>({ where: { id: value.id, profile: value.profile } }).then(found => {
                    if(found==null){
                        value.save()
                    }else{
                        found.setDataValue("completed", value.completed)
                        found.setDataValue("archived", value.archived)
                        found.setDataValue("test", value.test)
                        found.save()
                    }
                })
            }))
            return res.json(data[0])
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(401).json((err as ValidationError).errors)
            }
            return next(err)
        }
    })

router.route("/user/:id/local")
    .get(async (req: MyRequest, res: express.Response, next: express.NextFunction) => {
        return res.json(await LocalEvent.findAll())
    })
    .post(async (req: MyRequest, res: express.Response, next: express.NextFunction) => {
        if (req.body.data === undefined) {
            return res.status(401).json('Provide "data"')
        }

        if (!isArray(req.body.data)) {
            return res.status(401).json('"data" needs to be an array')
        }

        let profile = Number.parseInt(req.params.id)

        let data: Array<LocalEvent> = (req.body.data as Array<{
            profile: number
            id: number
            subject: number
            teacher: number
            archived: boolean
            title: String
            content: String
            type: String
            completed_date: number
            day: number
        }>).map(value => {
            value.profile = Number.parseInt(req.params.id)
            return new LocalEvent(value)
        })

        /*
                data.forEach((val) => {
        
                })
                LocalEvent.upsert()*/
        return res.json(data)
    })