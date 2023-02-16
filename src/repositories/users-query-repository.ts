import {userType} from "../models/types";
import {usersCollection, usersRepository} from "./users-repository";
import {paginationUserOutputModel} from "../models/models";

function sort(sortDirection: string){
    return (sortDirection === 'desc') ? -1 : 1;
}

function skipped(pageNumber: string, pageSize: string): number {
    return (+pageNumber - 1) * (+pageSize);
}

export const usersQueryRepo = {

    async getAllUsers(
        sortBy: string,
        sortDirection: string,
        pageNumber: string,
        pageSize: string,
        searchLoginTerm: string,
        searchEmailTerm: string,) {

        let usersCount = await usersCollection.countDocuments({$or:[{login: new RegExp(searchLoginTerm, "gi")},{email: new RegExp(searchEmailTerm, "gi")}]})
        //let usersCount = await usersCollection.countDocuments({})

        let users = await usersCollection.find({$or:[{login: new RegExp(searchLoginTerm, "gi")},{email: new RegExp(searchEmailTerm, "gi")}]})
        //let users = await usersCollection.find({})
            .sort({[sortBy]: sort(sortDirection)})
            .skip(skipped(pageNumber, pageSize))
            .limit(+pageSize)
            .toArray()

        let outUsers = users.map((users: userType) => {
            return {
                id: users._id.toString(),
                login: users.login,
                email: users.email,
                createdAt: users.createdAt
            }
        })

        let pageCount = Math.ceil(usersCount / +pageSize)

        let outputUsers: paginationUserOutputModel = {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: usersCount,
            items: outUsers
        }
        return outputUsers

    }
}