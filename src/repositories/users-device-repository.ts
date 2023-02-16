import {userDeviceDBType, userDeviceOutputType} from "../models/types";
import {client} from "./db";
import {ObjectId} from "mongodb";

export const userDeviceCollection = client.db("blogsAndPosts").collection<userDeviceDBType>("userDevices")
export const userDeviceRepo = {

    async addDeviceInfo(newDevice: userDeviceDBType): Promise<boolean> {
        const result = await userDeviceCollection.insertOne(newDevice);
        return result.acknowledged
    },

    async getDeviceById(deviceId: string){
        if (ObjectId.isValid(deviceId)){
            let _id = new ObjectId(deviceId)
            const foundDevice = await userDeviceCollection.findOne({"_id": _id})
            if (foundDevice){
                return foundDevice
            } else return null
        }

    },

    async getActiveUserDevices(userId: ObjectId){
        const activeUserDevices = await userDeviceCollection.find({"userId": userId}).toArray()

        return  activeUserDevices.map((device) => ({
                ip: device.ip,
                title: device.title,
                lastActiveDate: device.lastActiveDate,
                deviceId: device._id.toString()
        }))
    },

    async deleteAllUserDevicesExceptCurrent(userId: ObjectId, deviceId: string): Promise<boolean>{
        if (ObjectId.isValid(deviceId)){
            let _id = new ObjectId(deviceId)
            const result = await userDeviceCollection.deleteMany({$and: [{"userId": userId}, {"_id": {$ne: _id}}]})
            return result.acknowledged
        }
        else return false
    },

    async deleteUserDeviceById(userId: ObjectId, deviceId: string): Promise<boolean>{
        if (ObjectId.isValid(deviceId)){
            let _id = new ObjectId(deviceId)
            const result = await userDeviceCollection.deleteOne({$and:[{"_id": _id},{"userId": userId}]})
            return result.deletedCount === 1
        }
        else return false
    },

    async getDeviceByUsersAndDeviceId(userId: ObjectId, deviceId: string){
        if (ObjectId.isValid(userId) && ObjectId.isValid(deviceId)){
            let _id = new ObjectId(deviceId)
            let userIdObj = new ObjectId(userId)
            const device = await userDeviceCollection.findOne({$and:[{"_id": _id},{"userId": userIdObj}]})
            if (device){
                return device
            }
            else return null
        }
    },

    async refreshDeviceInfo (deviceId: string, lastActiveDate: string, expirationDate: string): Promise<boolean>{
        if (ObjectId.isValid(deviceId)) {
            let _id = new ObjectId(deviceId)
            const result = await userDeviceCollection.updateOne({"_id": _id},{
                $set: {
                    "lastActiveDate": lastActiveDate,
                    "expirationDate": expirationDate
                }
            })
            return result.matchedCount === 1
        }
        else return false
    },

    async deleteAllDevices(): Promise<boolean>{
        const result = await userDeviceCollection.deleteMany({})
        return result.acknowledged
    }

    //async refreshDeviceInfo

}