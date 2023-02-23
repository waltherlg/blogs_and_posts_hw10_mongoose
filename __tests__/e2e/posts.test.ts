import request from "supertest"
import {app} from '../../src'
import {describe} from "node:test";
import {response} from "express";

const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
const basicAuthWrongPassword = Buffer.from('admin:12345').toString('base64');
const basicAuthWrongLogin = Buffer.from('12345:qwerty').toString('base64');
let testedBlogId: string
describe('01 /posts validation', () => {
    beforeAll(async () => {
        await request(app).delete(('/testing/all-data'))
    })

    it('01-00 Create new blog for tests 201', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .set('Authorization', `Basic ${basicAuthRight}`)
            .send({
                name: "newBlogName6",
                description: 'newDescription6',
                websiteUrl: 'https://www.someweb6.com'
            })
            .expect(201)

        const createdResponse = createResponse.body
        testedBlogId = createdResponse.id;

        expect(createdResponse).toEqual({
            id: testedBlogId,
            name: 'newBlogName6',
            description: 'newDescription6',
            websiteUrl: 'https://www.someweb6.com',
            createdAt: createdResponse.createdAt,
            isMembership: true
        })

    })

        it('01-01 should return 400 with wrong title', async () => {
            const createResponse = await request(app)
                .post('/posts')
                .set('Authorization', `Basic ${basicAuthRight}`)
                .send({
                    title: "",
                    shortDescription: 'some short description',
                    content: 'some new content',
                    blogId: testedBlogId
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


})
