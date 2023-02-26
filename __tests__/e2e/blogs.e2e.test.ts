import request from "supertest"
import {app} from '../../src/index'
import {describe} from "node:test";
import {response} from "express";
import {blogsService} from "../../src/domain/blogs-service";
import mongoose from "mongoose";


const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
const basicAuthWrongPassword = Buffer.from('admin:12345').toString('base64');
const basicAuthWrongLogin = Buffer.from('12345:qwerty').toString('base64');

const notExistingId = '111111111111111111111111'
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

    it ('01-16 /blogs POST = 400 if websiteUrl has the wrong format', async () => {
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

    it ('01-17 /blogs POST = 400 if no websiteUrl in body', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "newBlogName",
                description: 'newDescription'
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

    it ('01-18 /blogs POST = 400 if name is empty', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "",
                description: 'newDescription',
                websiteUrl: 'https://www.somewebcom.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "name"
                    }
                ]})
    })

    it ('01-19 /blogs POST = 400 if name is empty', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "",
                description: 'newDescription',
                websiteUrl: 'https://www.somewebcom.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "name"
                    }
                ]})
    })

    it ('01-20 /blogs POST = 400 if the name is more than 15 characters', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: "onemoreoneonemoreoneandonamore",
                description: 'newDescription',
                websiteUrl: 'https://www.somewebcom.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "name"
                    }
                ]})
    })

    it ('01-21 /blogs POST = 400 if the name is not a string', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({name: 45623485935,
                description: 'newDescription',
                websiteUrl: 'https://www.somewebcom.com'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "name"
                    }
                ]})
    })

    let blogIdForPostsOperations: string
    let blogNameForPostsOperations: string

    it('02-00 /posts POST = 201 Create new blog for tests', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                name: "blogForPost",
                description: 'this blog was created for testing posts',
                websiteUrl: 'https://www.blog-for-post.com'
            })
            .expect(201)

        const createdResponse = createResponse.body
        blogIdForPostsOperations = createdResponse.id;
        blogNameForPostsOperations = createdResponse.name

        expect(createdResponse).toEqual({
            id: blogIdForPostsOperations,
            name: 'blogForPost',
            description: 'this blog was created for testing posts',
            websiteUrl: 'https://www.blog-for-post.com',
            createdAt: createdResponse.createdAt,
            isMembership: true
        })

    })

    it('02-01 /posts POST = 400 with error massage if no title in body', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                shortDescription: 'some short description',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "title"
                    }
                ]
            })
    })

    it('02-02 /posts POST = 400 with error massage if empty title', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: "",
                shortDescription: 'some short description',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "title"
                    }
                ]
            })
    })

    it('02-03 /posts POST = 400 with error massage if title not string', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 543657445774,
                shortDescription: 'some short description',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "title"
                    }
                ]
            })
    })

    it('02-04 /posts POST = 400 with error massage if no shortDescription in body', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'somePostTitle',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "shortDescription"
                    }
                ]
            })
    })

    it('02-05 /posts POST = 400 with error massage if shortDescription is empty', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'somePostTitle',
                shortDescription: '',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "shortDescription"
                    }
                ]
            })
    })

    it('02-06 /posts POST = 400 with error massage if content is not a string', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'somePostTitle',
                shortDescription: 'some short description',
                content: 1565468623,
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "content"
                    }
                ]
            })
    })

    it('02-07 /posts POST = 400 with error massage if blogId not exist', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'somePostTitle',
                shortDescription: 'some short description',
                content: 'some new content',
                blogId: '111111111111111111111111'
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "blogId"
                    }
                ]
            })
    })

    it('02-07-1 /posts GET = 200 and empty array (with pagination)', async () => {
        const createResponse = await request(app)
            .get('/posts')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: [
                ]
            }
        )
    })

    let postIdForPostOperations: string

    it('02-08 /posts POST = 201 with created post if all is OK', async () => {
        const createResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'somePostTitle',
                shortDescription: 'some short description',
                content: 'some new content',
                blogId: blogIdForPostsOperations
            })
            .expect(201)

        const createdResponse = createResponse.body
        postIdForPostOperations = createdResponse.id

        expect(createdResponse).toEqual({
            id: postIdForPostOperations,
            title: 'somePostTitle',
            shortDescription: 'some short description',
            content: 'some new content',
            blogId: blogIdForPostsOperations,
            blogName: blogNameForPostsOperations,
            createdAt: createdResponse.createdAt
        })
    })

    it('02-09 /posts GET = 200 and array with one post (with pagination)', async () => {
        const createResponse = await request(app)
            .get('/posts')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [
                    {
                        id: postIdForPostOperations,
                        title: 'somePostTitle',
                        shortDescription: 'some short description',
                        content: 'some new content',
                        blogId: blogIdForPostsOperations,
                        blogName: blogNameForPostsOperations,
                        createdAt: expect.any(String)
                    }
                ]
            }
        )
    })

    it('02-10 /posts/:{postId} GET = 404 if postId is not exist', async  () => {
        await request(app)
            .get(`/posts/:111111111111111111111111`)
            .expect(404)
    })

    it('02-11 /posts/:{postId} GET = 200 and post', async  () => {
        const createResponse = await request(app)
            .get(`/posts/${postIdForPostOperations}`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            id: postIdForPostOperations,
            title: 'somePostTitle',
            shortDescription: 'some short description',
            content: 'some new content',
            blogId: blogIdForPostsOperations,
            blogName: blogNameForPostsOperations,
            createdAt: expect.any(String)
        })
    })

    it('02-12 /posts/:{postId} PUT = 401 if no auth data', async  () => {
        await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .send({
                title: 'updatedTitle',
                shortDescription: 'some updated short description',
                content: 'some updated content',
                blogId: blogIdForPostsOperations
            })
            .expect(401)
    })

    it('02-13 /posts/:{postId} PUT = 401 if wrong login', async  () => {
        await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthWrongLogin}`)
            .send({
                title: 'updatedTitle',
                shortDescription: 'some updated short description',
                content: 'some updated content',
                blogId: blogIdForPostsOperations
            })
            .expect(401)
    })

    it('02-14 /posts/:{postId} PUT = 400 if title too long', async  () => {
        const createResponse = await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'updatedTitleupdatedTitleupdatedTitleupdatedTitle',
                shortDescription: 'some updated short description',
                content: 'some updated content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "title"
                    }
                ]
            })
    })

    it('02-15 /posts/:{postId} PUT = 400 if shortDescription is empty', async  () => {
        const createResponse = await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'updatedTitle',
                shortDescription: '',
                content: 'some updated content',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "shortDescription"
                    }
                ]
            })
    })

    it('02-16 /posts/:{postId} PUT = 400 if no content in body', async  () => {
        const createResponse = await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'updatedTitle',
                shortDescription: 'some updated short description',
                blogId: blogIdForPostsOperations
            })
            .expect(400)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "content"
                    }
                ]
            })
    })

    it('02-17 /posts/:{postId} PUT = 204 if all is OK', async  () => {
        await request(app)
            .put(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                title: 'updatedTitle',
                shortDescription: 'some updated short description',
                content: 'some updated content',
                blogId: blogIdForPostsOperations
            })
            .expect(204)
    })

    it('02-18 /posts/:{postId} GET = 200 and post after updating', async  () => {
        const createResponse = await request(app)
            .get(`/posts/${postIdForPostOperations}`)
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            id: postIdForPostOperations,
            title: 'updatedTitle',
            shortDescription: 'some updated short description',
            content: 'some updated content',
            blogId: blogIdForPostsOperations,
            blogName: blogNameForPostsOperations,
            createdAt: expect.any(String)
        })
    })

    it('02-19 /posts/:{postId} DELETE = 401 if no auth data', async  () => {
        await request(app)
            .delete(`/posts/${postIdForPostOperations}`)
            .expect(401)
    })

    it('02-20 /posts/:{postId} DELETE = 204 if all OK', async  () => {
        await request(app)
            .delete(`/posts/${postIdForPostOperations}`)
            .set('Authorization', `Basic ${basicAuthRight}`)
            .expect(204)
    })

    it('02-21 /posts/:{postId} GET = 404 after deleting post by id', async  () => {
        await request(app)
            .get(`/posts/${postIdForPostOperations}`)
            .expect(404)
    })

    it('02-22 /posts GET = 200 and empty array (with pagination after deleting post by id)', async () => {
        const createResponse = await request(app)
            .get('/posts')
            .expect(200)

        const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: [
                ]
            }
        )
    })



})




// describe('02 /posts validation', () => {
//
//     beforeAll(async () => {
//         await request(app).delete(('/testing/all-data'))
//     })
//
//
//
//
//
// })