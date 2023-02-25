import request from "supertest"
import {app} from '../../src/index'
import {describe} from "node:test";
import {response} from "express";
import {blogsService} from "../../src/domain/blogs-service";
import mongoose from "mongoose";


const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
const basicAuthWrongPassword = Buffer.from('admin:12345').toString('base64');
const basicAuthWrongLogin = Buffer.from('12345:qwerty').toString('base64');
describe('01 /blogs', () => {

    let createdBlogId: string

    beforeAll(async () => {
        await request(app).delete(('/testing/all-data'))
        await blogsService.createBlog('newBlogName2', 'newDescription2', 'https://www.someweb2.com');
        await blogsService.createBlog('newBlogName3', 'newDescription3', 'https://www.someweb3.com');
        await blogsService.createBlog('newBlogName4', 'newDescription4', 'https://www.someweb4.com');
        await blogsService.createBlog('newBlogName5', 'newDescription5', 'https://www.someweb5.com');
    })

    // afterAll( async () => {
    //     await mongoose.disconnect()
    // })

    it ('01-00 /blogs GET  = 200 and array with 4 object (with pagination)', async () => {
        const createResponse = await request(app)
            .get('/blogs')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 4,
                items: [
                    {
                        id: expect.any(String),
                        name: 'newBlogName5',
                        description: 'newDescription5',
                        websiteUrl: 'https://www.someweb5.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName4',
                        description: 'newDescription4',
                        websiteUrl: 'https://www.someweb4.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName3',
                        description: 'newDescription3',
                        websiteUrl: 'https://www.someweb3.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName2',
                        description: 'newDescription2',
                        websiteUrl: 'https://www.someweb2.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    }
                ]
            }
        )
    })

    it ('00-01 /blogs POST  = 401 if no authorization data', async () => {
        await request(app)
            .post('/blogs')
            .send({name: "newBlog",
                description: 'newDescription',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(401)
    })

    it ('01-02 /blogs POST  = 401 if wrong password', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthWrongPassword}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(401)
    })

    it ('01-03 /blogs POST  = 401 if wrong login', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthWrongLogin}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(401)
    })

    it ('01-04 /blogs POST  = 201 create new blog', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "createdBlog6",
                description: 'newDescription6',
                websiteUrl: 'https://www.someweb6.com'
            })
            .expect(201)

            const createdResponse = createResponse.body
        createdBlogId = createdResponse.id;

        expect(createdResponse).toEqual({
            id: createdBlogId,
            name: 'createdBlog6',
            description: 'newDescription6',
            websiteUrl: 'https://www.someweb6.com',
            createdAt: createdResponse.createdAt,
            isMembership: true
        })

    })

    it ('01-05 /blogs GET = 200 return blog by id', async () => {
        const createResponse = await request(app)
            .get(`/blogs/${createdBlogId}`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            id: createdBlogId,
            name: 'createdBlog6',
            description: 'newDescription6',
            websiteUrl: 'https://www.someweb6.com',
            createdAt: expect.any(String),
            isMembership: true
        })
    })

    it ('01-06 /blogs/:{blogId} PUT = 401 if wrong login', async () => {
        await request(app)
            .put(`/blogs/${createdBlogId}`)
            .set('Authorization', `Basic ${basicAuthWrongLogin}`)
            .send({name: "updatedName6",
                description: 'updatedDescription6',
                websiteUrl: 'https://www.updatedsomeweb6.com'
            })
            .expect(401)
    })

    it ('01-07 /blogs/:{blogId} PUT = 204 204 if id and auth is OK', async () => {
        await request(app)
            .put(`/blogs/${createdBlogId}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "updatedName6",
                description: 'updatedDescription6',
                websiteUrl: 'https://www.updatedsomeweb6.com'
            })
            .expect(204)
    })

    it ('01-08 /blogs GET = 200 and array with 5 object (with pagination)', async () => {
        const createResponse = await request(app)
            .get('/blogs')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 5,
                items: [
                    {
                        id: expect.any(String),
                        name: 'updatedName6',
                        description: 'updatedDescription6',
                        websiteUrl: 'https://www.updatedsomeweb6.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName5',
                        description: 'newDescription5',
                        websiteUrl: 'https://www.someweb5.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName4',
                        description: 'newDescription4',
                        websiteUrl: 'https://www.someweb4.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName3',
                        description: 'newDescription3',
                        websiteUrl: 'https://www.someweb3.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName2',
                        description: 'newDescription2',
                        websiteUrl: 'https://www.someweb2.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    }
                ]
            }
        )
    })

    it ('01-09 /blogs/:{blogId} DELETE = 401 if no authorization data', async () => {
        await request(app)
            .delete(`/blogs/${createdBlogId}`)
            .expect(401)
    })

    it ('01-10 /blogs/:{blogId} DELETE = 404 if blogId not exist', async () => {
        await request(app)
            .delete(`/blogs/:111111111111111111111111`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(404)
    })

    it ('01-11 /blogs/:{blogId} DELETE = 204 if id and auth is OK', async () => {
        const auth = Buffer.from('admin:qwerty').toString('base64');
        await request(app)
            .delete(`/blogs/${createdBlogId}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(204)
    })

    it ('01-12 /blogs GET = 200 and array with 4 object (with pagination, after deleting blog bi Id)', async () => {
        const createResponse = await request(app)
            .get('/blogs')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 4,
                items: [
                    {
                        id: expect.any(String),
                        name: 'newBlogName5',
                        description: 'newDescription5',
                        websiteUrl: 'https://www.someweb5.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName4',
                        description: 'newDescription4',
                        websiteUrl: 'https://www.someweb4.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName3',
                        description: 'newDescription3',
                        websiteUrl: 'https://www.someweb3.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName2',
                        description: 'newDescription2',
                        websiteUrl: 'https://www.someweb2.com',
                        createdAt: expect.any(String),
                        isMembership: true
                    }
                ]
            }
        )
    })
})

describe('01 /blogs validation tests', () => {

    it ('01-13 /blogs POST = 400 if no description', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "newBlogName",
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "description"
                    }
                ]
            })
    })

    it ('01-14 /blogs POST = 400 if description not a string', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "newBlogName",
                description: 1564852,
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "description"
                    }
                ]
            })
    })

    it ('01-15 /blogs POST = 400 if description is empty', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "newBlogName",
                description: '',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "description"
                    }
                ]
            })
    })

    it ('01-14 /blogs POST = 400 if wrong websiteUrl', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'www.somewebcom'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "websiteUrl"
                    }
                ]})
    })

})