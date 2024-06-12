

import request from "supertest";
import {app} from "../../src/app";
import {Authorize} from "../../src/middleware/authorization-middleware";
import User from "../../src/data/models/User";

const friendRoute = '/api/friends';
const userRoute = '/api/user';

const validUser = 'john doe';
const usernameShort = 'a';
const userNameLong = 'this name is way too long to be valid username';
const nullValue = null;
const undefinedValue = undefined;

beforeEach(async()=>{
    await request(app).delete(userRoute);
    
})
afterEach(async()=>{
    await request(app).delete(userRoute);
})




describe('POST', ()=>{

    test('should return 400, because length of the user name is bad (too short + too long)', async ()=>{

        const responseShort = await request(app).post(`${friendRoute}/${usernameShort}/friends/${validUser}`);
        const responseLong = await request(app).post(`${friendRoute}/${userNameLong}/friends/${validUser}`);

        expect(responseShort.statusCode).toBe(400);
        expect(responseLong.statusCode).toBe(400);
    })

    test('should return 400, because length of the friend name is bad (too short + too long', async()=>{
        const responseShort = await request(app).post(`${friendRoute}/${validUser}/friends/${usernameShort}`);
        const responseLong = await request(app).post(`${friendRoute}/${validUser}/friends/${userNameLong}`);

        expect(responseShort.statusCode).toBe(400);
        expect(responseLong.statusCode).toBe(400);
    })

    test('should return 400, because user name is null or undefined', async()=>{
        const responseNull = await request(app).post(`${friendRoute}/${nullValue}/friends/${validUser}`);
        const responseUndefined = await request(app).post(`${friendRoute}/${undefinedValue}/friends/${validUser}`);

        expect(responseNull.statusCode).toBe(400);
        expect(responseUndefined.statusCode).toBe(400);
    })

    test('should return 400, because friend name is null or undefined', async()=>{
        const responseNull = await request(app).post(`${friendRoute}/${validUser}/friends/${nullValue}`);
        const responseUndefined = await request(app).post(`${friendRoute}/${validUser}/friends/${undefinedValue}`);

        expect(responseNull.statusCode).toBe(400);
        expect(responseUndefined.statusCode).toBe(400);
    })

    test('should return 400, because user does not exist', async()=>{
        const randomUser = 'Batman';
        const responseNotExists = await request(app).post(`${friendRoute}/${validUser}/friends/${randomUser}`);
        expect(responseNotExists.statusCode).toBe(400);
    })
    test('should return 400, because friend does not exist', async()=>{
        const randomUser = 'Batman';
        const responseNotExists = await request(app).post(`${friendRoute}/${randomUser}/friends/${validUser}`);
        expect(responseNotExists.statusCode).toBe(400);
    })

    test('should return 400, because user and friend are the same', async()=>{
        const responseSameUser = await request(app).post(`${friendRoute}/${validUser}/friends/${validUser}`);
        expect(responseSameUser.statusCode).toBe(400);

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

        const responseAddFriend = await request(app).post(`${friendRoute}/${validUser}/friends/${friendUser}`);
        expect(responseAddFriend.statusCode).toBe(200);

        const response = await request(app).get(`${friendRoute}/${validUser}`);
        expect(response.body.length).toBe(1);
        expect(response.body[0].userName).toBe(friendUser);
    })
})


describe('GET', ()=>{

    test('should return 400, because length of the user name is bad (too short + too long)', async ()=>{

        const responseShort = await request(app).get(`${friendRoute}/${usernameShort}`);
        const responseLong = await request(app).get(`${friendRoute}/${userNameLong}`);

        expect(responseShort.statusCode).toBe(400);
        expect(responseLong.statusCode).toBe(400);
    })

    test('should return 400, because user name is null or undefined', async()=>{
        const responseNull = await request(app).get(`${friendRoute}/${nullValue}`);
        const responseUndefined = await request(app).get(`${friendRoute}/${undefinedValue}`);

        expect(responseNull.statusCode).toBe(400);
        expect(responseUndefined.statusCode).toBe(400);
    })

    test('should return 400, because user does not exist', async()=>{
        const responseNotExists = await request(app).get(`${friendRoute}/${validUser}`);
        expect(responseNotExists.statusCode).toBe(400);
    })

    test('should return 404, because user has no friends', async()=> {
        await request(app) // create user test is done in the user-router.test.ts
            .post('/api/user')
            .send({
                name: validUser
            });
        const response = await request(app).get(`${friendRoute}/${validUser}`);
        expect(response.statusCode).toBe(404);
    })

    test('should return 200, because user is valid and has a friend', async()=>{
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

        await request(app).post(`${friendRoute}/${validUser}/friends/${friendUser}`);

        const response = await request(app).get(`${friendRoute}/${validUser}`);
        expect(response.body.length).toBe(1);
        expect(response.body[0].userName).toBe(friendUser);
    })

})


describe('Delete', ()=>{

    test('should return 400, because length of the user name is bad (too short + too long)', async ()=>{

        const responseShort = await request(app).delete(`${friendRoute}/${usernameShort}/friends/${validUser}`);
        const responseLong = await request(app).delete(`${friendRoute}/${userNameLong}/friends/${validUser}`);

        expect(responseShort.statusCode).toBe(400);
        expect(responseLong.statusCode).toBe(400);
    })

    test('should return 400, because length of the friend name is bad (too short + too long', async()=>{
        const responseShort = await request(app).delete(`${friendRoute}/${validUser}/friends/${usernameShort}`);
        const responseLong = await request(app).delete(`${friendRoute}/${validUser}/friends/${userNameLong}`);

        expect(responseShort.statusCode).toBe(400);
        expect(responseLong.statusCode).toBe(400);
    })

    test('should return 400, because user name is null or undefined', async()=>{
        const responseNull = await request(app).delete(`${friendRoute}/${nullValue}/friends/${validUser}`);
        const responseUndefined = await request(app).delete(`${friendRoute}/${undefinedValue}/friends/${validUser}`);

        expect(responseNull.statusCode).toBe(400);
        expect(responseUndefined.statusCode).toBe(400);
    })

    test('should return 400, because friend name is null or undefined', async()=>{
        const responseNull = await request(app).delete(`${friendRoute}/${validUser}/friends/${nullValue}`);
        const responseUndefined = await request(app).delete(`${friendRoute}/${validUser}/friends/${undefinedValue}`);

        expect(responseNull.statusCode).toBe(400);
        expect(responseUndefined.statusCode).toBe(400);
    })

    test('should return 400, because user does not exist', async()=>{
        const randomUser = 'Batman';
        const responseNotExists = await request(app).delete(`${friendRoute}/${validUser}/friends/${randomUser}`);
        expect(responseNotExists.statusCode).toBe(400);
    })
    test('should return 400, because friend does not exist', async()=>{
        const randomUser = 'Batman';
        const responseNotExists = await request(app).delete(`${friendRoute}/${randomUser}/friends/${validUser}`);
        expect(responseNotExists.statusCode).toBe(400);
    })

    test('should return 400, because user and friend are the same', async()=>{
        const responseSameUser = await request(app).delete(`${friendRoute}/${validUser}/friends/${validUser}`);
        expect(responseSameUser.statusCode).toBe(400);

    })

    test('should return 404, because user has no friends, therefore they cannot be deleted', async()=> {
        const friendUser = 'Mater'
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


        const response = await request(app).delete(`${friendRoute}/${validUser}/friends/${friendUser}`);
        expect(response.statusCode).toBe(404);
    })


    test('should return 200, because user has friends, and one can be removed', async()=> {
        const friendUser = 'Mater'
        const otherFriendUser = 'McQueen'
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

        await request(app) // create user test is done in the user-router.test.ts
            .post('/api/user')
            .send({
                name: otherFriendUser
            });

        await request(app).post(`${friendRoute}/${validUser}/friends/${friendUser}`);
        await request(app).post(`${friendRoute}/${validUser}/friends/${otherFriendUser}`);

        const responseBefore = await request(app).get(`${friendRoute}/${validUser}`);
        expect(responseBefore.body.length).toBe(2);
        expect(responseBefore.body[0].userName).toBe(friendUser);
        expect(responseBefore.body[1].userName).toBe(otherFriendUser);

        const responseAfter = await request(app).delete(`${friendRoute}/${validUser}/friends/${friendUser}`);
        console.log(responseAfter.body);

        expect(responseAfter.statusCode).toBe(200);
        expect(responseAfter.body.length).toBe(1);
        expect(responseAfter.body[0].userName).toBe(otherFriendUser);
    })
})