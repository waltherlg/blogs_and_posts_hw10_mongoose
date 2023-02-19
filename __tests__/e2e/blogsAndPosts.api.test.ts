import request from "supertest"
import {app} from '../../src'
import {describe} from "node:test";
import {response} from "express";

describe('/blogs', () => {

    beforeAll(async () => {
        await request(app).delete(('/testing/all-data'))
    })

    it('should return status 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200,  {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it ('should not create new blog with status 401 if not authorize', async () => {
        await request(app)
            .post('/blogs')
            .send({name: "newBlog",
                description: 'newDescription',
                websiteUrl: 'www.someweb.com'
            })
            .expect(401)
    })

    it ('should create new blog with status 201', async () => {
        const auth = Buffer.from('admin:qwerty').toString('base64');
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${auth}`)
            .send({name: "newBlogName",
                description: 'newDescription',
                websiteUrl: 'www.someweb.com'
            })
            .expect(201)

            const createdResponse = createResponse.body

        expect(createdResponse).toEqual({
            id: expect.any(String),
            name: 'newBlogName',
            description: 'newDescription',
            websiteUrl: 'www.someweb.com',
            createdAt: expect.any(String),
            isMembership: true
        })
        expect(createdResponse.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);
    })


})