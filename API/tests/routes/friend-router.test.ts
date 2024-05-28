import request from "supertest";
import {app} from "../../src/app";


const routePath = '/api/friends';
describe('POST', ()=>{
    // TODO:
    const validUser = 'john doe';
    const usernameShort = 'a';
    const userNameLong = 'this name is way too long to be valid username';
    const nullValue = null;
    const undefinedValue = undefined;
    test('should return 400, because length of the user name is bad (too short + too long)', async ()=>{

        const responseShort = await request(app).post(`${routePath}/${usernameShort}/friends/${validUser}`);
        const responseLong = await request(app).post(`${routePath}/${userNameLong}/friends/${validUser}`);

        expect(responseShort.status).toBe(400);
        expect(responseLong.status).toBe(400);
    })

    test('should return 400, because length of the friend name is bad (too short + too long', async()=>{
        const responseShort = await request(app).post(`${routePath}/${validUser}/friends/${usernameShort}`);
        const responseLong = await request(app).post(`${routePath}/${validUser}/friends/${userNameLong}`);

        expect(responseShort.status).toBe(400);
        expect(responseLong.status).toBe(400);
    })

    test('should return 400, because user name is null or undefined', async()=>{
        const responseNull = await request(app).post(`${routePath}/${nullValue}/friends/${validUser}`);
        const responseUndefined = await request(app).post(`${routePath}/${undefinedValue}/friends/${validUser}`);

        expect(responseNull.status).toBe(400);
        expect(responseUndefined.status).toBe(400);
    })

    test('should return 400, because friend name is null or undefined', async()=>{
        const responseNull = await request(app).post(`${routePath}/${validUser}/friends/${nullValue}`);
        const responseUndefined = await request(app).post(`${routePath}/${validUser}/friends/${undefinedValue}`);

        expect(responseNull.status).toBe(400);
        expect(responseUndefined.status).toBe(400);
    })

    test('should return 400, because user does not exist', async()=>{
        const randomUser = 'Batman';
        const responseNotExists = await request(app).post(`${routePath}/${validUser}/friends/${randomUser}`);
        expect(responseNotExists.status).toBe(400);
    })
    test('should return 400, because friend does not exist', async()=>{
        const randomUser = 'Batman';
        const responseNotExists = await request(app).post(`${routePath}/${randomUser}/friends/${validUser}`);
        expect(responseNotExists.status).toBe(400);
    })

    test('should return 400, because user and friend are the same', async()=>{
        const responseSameUser = await request(app).post(`${routePath}/${validUser}/friends/${validUser}`);
        expect(responseSameUser.status).toBe(400);

    })

    test('should return 200, because user and friend are valid', async()=>{
        const friendUser = 'McQueen';
        await request(app) // create user test is done in the user-router.test.ts
            .post('/api/user')
            .send({
                name: validUser
            });

        await request(app) // create user test is done in the user-router.test.ts
            .post('/api/user')
            .send({
                name: friendUser
            });

        const responseAddFriend = await request(app).post(`${routePath}/${validUser}/friends/${friendUser}`);
        expect(responseAddFriend.status).toBe(200);

        // TODO: unit test get route first
        const response = await request(app).get(`${routePath}/${validUser}`);
        console.log(response.body);
        expect(response.body.length).toBe(1);
        expect(response.body[0].userName).toBe(friendUser);
    })
})


describe('GET', ()=>{
    // TODO:
})


describe('Delete', ()=>{
    // TODO:
})