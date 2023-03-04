import {Request, Response, Router} from "express";
import {refreshTokenCheck} from "../middlewares/basic-auth.middleware";
import {deviceService} from "../domain/device-service";
import {RequestWithParams} from "../models/types";
import {ObjectId} from "mongodb";
import {isUserOwnerOfDevice} from "../middlewares/other-midlevares";

export const securityRouter = Router({})

securityRouter.get('/devices',
    refreshTokenCheck,
    async (req: Request, res: Response) => {
    const usersDevises = await deviceService.getActiveUserDevices(req.userId!)
        res.status(200).send(usersDevises)
})

securityRouter.delete('/devices',
    refreshTokenCheck,
    async (req: Request, res: Response) => {
        const isAllUsersDevisesDeleted = await deviceService.deleteAllUserDevicesExceptCurrent(req.userId, req.deviceId)
        if (isAllUsersDevisesDeleted) return res.sendStatus(204)
        else res.sendStatus(404)
    })

securityRouter.delete('/devices/:deviceId',
    refreshTokenCheck,
    isUserOwnerOfDevice,
    async (req: RequestWithParams<any>, res: Response) => {
        const isDeviceDeleted = await deviceService.deleteUserDeviceById(req.userId, req.params.deviceId)
        if (isDeviceDeleted) {
            return res.sendStatus(204)
        } else {
            res.status(404).send("some error")
        }
    })

