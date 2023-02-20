import request from "supertest"
import {app} from '../../src'
import {describe} from "node:test";
import {response} from "express";
import {blogsService} from "../../src/domain/blogs-service";

describe('/blogs', () => {

    let createdBlogId

    beforeAll(async () => {
        await request(app).delete(('/testing/all-data'))
        await blogsService.createBlog('newBlogName2', 'newDescription2', 'www.someweb2.com');
        await blogsService.createBlog('newBlogName3', 'newDescription3', 'www.someweb3.com');
        await blogsService.createBlog('newBlogName4', 'newDescription4', 'www.someweb4.com');
        await blogsService.createBlog('newBlogName5', 'newDescription5', 'www.someweb5.com');
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
                        websiteUrl: 'www.someweb5.com',
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName4',
                        description: 'newDescription4',
                        websiteUrl: 'www.someweb4.com',
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName3',
                        description: 'newDescription3',
                        websiteUrl: 'www.someweb3.com',
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        name: 'newBlogName2',
                        description: 'newDescription2',
                        websiteUrl: 'www.someweb2.com',
                        createdAt: expect.any(String)
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
                websiteUrl: 'www.someweb.com'
            })
            .expect(401)
    })

    it ('should status 401 with wrong password', async () => {
        const auth = Buffer.from('admin:11111').toString('base64');
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'www.someweb.com'
            })
            .expect(401)
    })

    it ('should return 401 with wrong login', async () => {
        const auth = Buffer.from('nodmin:qwerty').toString('base64');
        await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'www.someweb.com'
            })
            .expect(401)
    })

    it ('should return 400 with wrong description', async () => {
        const auth = Buffer.from('admin:qwerty').toString('base64');
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({name: "newBlogName",
                websiteUrl: 'www.someweb.com'
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
        const auth = Buffer.from('admin:qwerty').toString('base64');
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${auth}`)
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
        const auth = Buffer.from('admin:qwerty').toString('base64');
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({name: "newBlogName6",
                description: 'newDescription6',
                websiteUrl: 'www.someweb6.com'
            })
            .expect(201)

            const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            id: expect.any(String),
            name: 'newBlogName6',
            description: 'newDescription6',
            websiteUrl: 'www.someweb6.com',
            createdAt: expect.any(String),
            isMembership: true
        })
        expect(createdResponse.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);
        createdBlogId = createdResponse.id;
    })






})