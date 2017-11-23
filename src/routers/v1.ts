import * as express from 'express'
import { MyRequest } from '../app'

import LocalEvent from '../models/localEvent'
import RemoteEventInfo from '../models/remoteEventInfo'
import { IsArray } from 'sequelize-typescript/lib/annotations/validation/IsArray';
import { isArray } from 'util';

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
            fooId: number
            profile: number
            id: number
            completed: boolean
            test: boolean
            archived: boolean
        }>).map(value => {
            value.profile = profile
            value.fooId = Number.parseInt(profile.toString(10) + value.id.toString(10))
            return new RemoteEventInfo(value)
        })
        try {
            await Promise.all(data.map(value => {
                return RemoteEventInfo.upsert<RemoteEventInfo>(value)
            }))
            return res.json(data)
        } catch (err) {
            return next(err)
        }
        /*try {
            await RemoteEventInfo.bulkCreate<RemoteEventInfo>(data)
            return res.json("OK")
        }catch(err){
            return next(err)
        }*/
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
            fooId: number | undefined
            profile: number | undefined
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
            value.fooId = Number.parseInt(req.params.id.toString(10) + value.id.toString(10))
            return new LocalEvent(value)
        })

        /*
                data.forEach((val) => {
        
                })
                LocalEvent.upsert()*/
        return res.json(data)
    })