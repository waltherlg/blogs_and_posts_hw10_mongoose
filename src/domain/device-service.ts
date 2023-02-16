import {ObjectId} from "mongodb";
import {userDeviceRepo} from "../repositories/users-device-repository";
import {userDeviceOutputType} from "../models/types";
import {jwtService} from "../application/jwt-service";
import {tr} from "date-fns/locale";

export const deviceService = {

    async getActiveUserDevices(userId: ObjectId){
        let foundDevices = await userDeviceRepo.getActiveUserDevices(userId)
        return foundDevices
    },

    async deleteAllUserDevicesExceptCurrent(userId: ObjectId, refreshToken: string){
        const deviceId = await jwtService.getDeviceIdFromRefreshToken(refreshToken)
        let isDevicesDeleted = await userDeviceRepo.deleteAllUserDevicesExceptCurrent(userId, deviceId)
        return isDevicesDeleted
    },

    async deleteUserDeviceById(userId: ObjectId, deviceId: string): Promise<boolean>{
        let isDeviceDeleted = await userDeviceRepo.deleteUserDeviceById(userId, deviceId)
        return isDeviceDeleted
    },

    async getCurrentDevise(userId: ObjectId, deviceId: string){
        let currentDevice = await userDeviceRepo.getDeviceByUsersAndDeviceId(userId, deviceId)
        return currentDevice
    },

    async doesUserHaveThisDevice(userId: ObjectId, deviceId: string): Promise<boolean>{
        let isDevice = await userDeviceRepo.getDeviceByUsersAndDeviceId(userId, deviceId)
        if (isDevice){
            return true
        } else return false
    },

    async isDeviceExist(deviceId: string){
      let isExist = await userDeviceRepo.getDeviceById(deviceId)
        return !!isExist;
    },

    async deleteAllDevices(): Promise<boolean>{
        return await userDeviceRepo.deleteAllDevices()
    },
}