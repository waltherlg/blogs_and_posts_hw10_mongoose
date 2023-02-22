import request from "supertest"
import {app} from '../../src'
import {describe} from "node:test";
import {response} from "express";
import {blogsService} from "../../src/domain/blogs-service";


const rightAuth = Buffer.from('admin:qwerty').toString('base64');
const wrongPasswordAuth = Buffer.from('admin:12345').toString('base64');
const wrongLoginAuth = Buffer.from('12345:qwerty').toString('base64');
describe('/blogs', () => {

    let createdBlogId: string

    beforeAll(async () => {
        await request(app).delete(('/testing/all-data'))
        await blogsService.createBlog('newBlogName2', 'newDescription2', 'https://www.someweb2.com');
        await blogsService.createBlog('newBlogName3', 'newDescription3', 'https://www.someweb3.com');
        await blogsService.createBlog('newBlogName4', 'newDescription4', 'https://www.someweb4.com');
        await blogsService.createBlog('newBlogName5', 'newDescription5', 'https://www.someweb5.com');
    })

    it('should return status 200 and array with 4 object (with pagination)', async () => {
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

    it ('401 NOT create new blog, if no authorization data', async () => {
        await request(app)
            .post('/blogs')
            .send({name: "newBlog",
                description: 'newDescription',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(401)
    })

    it ('should status 401 with wrong password', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${wrongPasswordAuth}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(401)
    })

    it ('should return 401 with wrong login', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${wrongLoginAuth}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'https://www.someweb.com'
            })
            .expect(401)
    })

    it ('should return 400 with wrong description', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${rightAuth}`)
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

    it ('should return 400 with wrong websiteUrl', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${rightAuth}`)
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

    it ('should create new blog with status 201', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${rightAuth}`)
            .send({name: "newBlogName6",
                description: 'newDescription6',
                websiteUrl: 'https://www.someweb6.com'
            })
            .expect(201)

            const createdResponse = createResponse.body
        createdBlogId = createdResponse.id;

        expect(createdResponse).toEqual({
            id: createdBlogId,
            name: 'newBlogName6',
            description: 'newDescription6',
            websiteUrl: 'https://www.someweb6.com',
            createdAt: createdResponse.createdAt,
            isMembership: true
        })

    })

    it ('should return blog by id', async () => {
        const createResponse = await request(app)
            .get(`/blogs/${createdBlogId}`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            id: expect.any(String),
            name: 'newBlogName6',
            description: 'newDescription6',
            websiteUrl: 'https://www.someweb6.com',
            createdAt: expect.any(String),
            isMembership: true
        })
    })

    it ('should update blog by id', async () => {
        await request(app)
            .put(`/blogs/${createdBlogId}`)
            .set('Authorization', `Basic ${rightAuth}`)
            .send({name: "updatedName6",
                description: 'updatedDescription6',
                websiteUrl: 'https://www.updatedsomeweb6.com'
            })
            .expect(204)
    })

    it('should return status 200 and array with 5 object (with pagination)', async () => {
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

    it ('should NOT DELETE blog by id without authorization', async () => {
        await request(app)
            .delete(`/blogs/${createdBlogId}`)
            .expect(401)
    })

    it ('should return 404 if try delete blog by non existing id', async () => {
        await request(app)
            .delete(`/blogs/:111111111111111111111111`)
            .set('Authorization', `Basic ${rightAuth}`)
            .expect(404)
    })

    it ('should DELETE blog by id', async () => {
        const auth = Buffer.from('admin:qwerty').toString('base64');
        await request(app)
            .delete(`/blogs/${createdBlogId}`)
            .set('Authorization', `Basic ${rightAuth}`)
            .expect(204)
    })

})