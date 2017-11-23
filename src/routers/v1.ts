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
        return res.json(await RemoteEventInfo.findAll({ where: { profile: req.params.id }, attributes: { exclude: ["profile"] } }))
    })
    .post(async (req: MyRequest, res: express.Response, next: express.NextFunction) => {
        if (req.body === undefined) {
            return res.status(401).json('Provide body')
        }

        if (!isArray(req.body)) {
            return res.status(401).json('Body needs to be an array')
        }

        let profile = Number.parseInt(req.params.id)

        let data: Array<RemoteEventInfo> = (req.body as Array<{
            profile: number | undefined
            id: number
            completed: boolean
            test: boolean
            archived: boolean
        }>).map(value => {
            value.profile = profile
            return RemoteEventInfo.build(value)
        })

        try {
            await Promise.all(data.map(value => {
                return RemoteEventInfo.findOne<RemoteEventInfo>({ where: { id: value.id, profile: value.profile } }).then(found => {
                    if (found == null) {
                        value.save()
                    } else {
                        found.setDataValue("completed", value.completed)
                        found.setDataValue("archived", value.archived)
                        found.setDataValue("test", value.test)
                        console.log(found)
                        found.save()
                    }
                })
            }))
            return res.json(data)
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(401).json((err as ValidationError).errors)
            }
            return next(err)
        }
    })

router.route("/user/:id/local")
    .get(async (req: MyRequest, res: express.Response, next: express.NextFunction) => {
        return res.json(await LocalEvent.findAll({ where: { profile: req.params.id }, attributes: { exclude: ["profile"] } }))
    })
    .post(async (req: MyRequest, res: express.Response, next: express.NextFunction) => {
        if (req.body === undefined) {
            return res.status(401).json('Provide body')
        }

        if (!isArray(req.body)) {
            return res.status(401).json('Body needs to be an array')
        }

        let profile = Number.parseInt(req.params.id)

        let data: Array<LocalEvent> = (req.body as Array<{
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
            return LocalEvent.build(value)
        })

        try {
            await Promise.all(data.map(value => {
                return LocalEvent.findOne<LocalEvent>({ where: { id: value.id, profile: value.profile } }).then(found => {
                    if (found == null) {
                        value.save()
                    } else {
                        found.setDataValue("subject", value.subject)
                        found.setDataValue("teacher", value.teacher)
                        found.setDataValue("archived", value.archived)
                        found.setDataValue("title", value.title)
                        found.setDataValue("content", value.content)
                        found.setDataValue("type", value.type)
                        found.setDataValue("completed_date", value.completed_date)
                        found.setDataValue("day", value.day)
                        found.save()
                    }
                })
            }))
            return res.json(data)
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(401).json((err as ValidationError).errors)
            }
            return next(err)
        }
    })