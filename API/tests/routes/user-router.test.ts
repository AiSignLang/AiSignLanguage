import request from 'supertest';
import {app} from '../../src/app';
import {CREATED, NO_CONTENT, StatusCodes} from "http-status-codes";

import * as path from "node:path";
import fsSync from "fs";
import {getAvatarPath, getUserPath} from "../../src/Utils";

const routePath = '/api/user';
beforeEach(async()=>{
    await request(app).delete(routePath);

})
afterEach(async()=>{
    await request(app).delete(routePath);
})

describe('POST /api/user', () => {
    test('should create a new user', async () => {
        const username = 'John Doe';
        const response = await request(app)
            .post(routePath)
            .send({
                name: username
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.userName).toBe('John Doe');
    });

    test('should not create a user with the same name', async () => {
        const username = 'John Doe';
        const response = await request(app)
            .post(routePath)
            .send({
                name: username
            });
        const responseAgain = await request(app)
            .post(routePath)
            .send({
                name: username
            });
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        expect(responseAgain.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});
describe('PUT /api/user', () => {

    describe('/:username/avatar', ()=>{
        test('should update the avatar of a user', async () => {

            const username = 'Van Gogh';

            await request(app).post(routePath).send({username: username});
            const response = await request(app)
                .put(`${routePath}/${username}/avatar`)
                .attach('avatar', path.join(__dirname, '../Download.jpeg')); // Adjust the path to the avatar image file

            expect(response.statusCode).toBe(200);
            expect(response.body.profilePic).toBeDefined();
        });

        test('should not update the avatar if the user does not exist', async () => {

            const username = 'Van Gogh';

            const response = await request(app)
                .put(`${routePath}/${username}/avatar`)
                .attach('avatar', path.join(__dirname, '../Download.jpeg')); // Adjust the path to the avatar image file

            expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        });

        test('should not update the avatar if no file is provided', async () => {
            const username = 'John Doe';
            await request(app).post(routePath).send({username: username});
            const response = await request(app)
                .put(`${routePath}/${username}/avatar`);

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });
    })

    describe('/:username', ()=>{

        test('should update name of an user', async () =>{
            const expectedNewName = 'Mickey Mouse';

            await request(app).post(routePath).send({username: 'John Doe'});
            const getBefore = await request(app).get(`${routePath}/John Doe`);
            expect(getBefore.body.userName).toBe('John Doe');

            await request(app).put(`${routePath}/John Doe`).send({username: expectedNewName})
            const getAfterJohn = await request(app).get(`${routePath}/John Doe`); // TODO: john should not exist anymore, but user mouse should exist here
            expect(getAfterJohn.statusCode).toBe(400);
            const getAfterMickeyMouse = await request(app).get(`${routePath}/${expectedNewName}`);
            expect(getAfterMickeyMouse.statusCode).toBe(200);
            expect(getAfterMickeyMouse.body.userName).toBe(expectedNewName);
        });

        test('should not update name, name does not fit validation (too short + too long)', async()=>{
            const nameOfUser = 'John Doe';
            await request(app).post(routePath).send({username: nameOfUser});
            const responseTooShort = await request(app).put(`${routePath}/${nameOfUser}`).send({name: 'x'});
            expect(responseTooShort.statusCode).toBe(400);

            const responseTooLong = await request(app).put(`${routePath}/${nameOfUser}`).send({name: 'invalid is way too long to be a username, validation should return bad requeset'});
            expect(responseTooLong.statusCode).toBe(400);

            const response = await request(app).get(`${routePath}/${nameOfUser}`);
            expect(response.statusCode).toBe(200); // TODO: hmm..
            expect(response.body.userName).toBe(nameOfUser);
        })

        test('should not update, name is null or undefined', async()=>{
            const nameOfUser = 'John Doe';
            await request(app).post(routePath).send({username: nameOfUser});
            const nullValue = null;
            const responseNull = await request(app).put(`${routePath}/${nameOfUser}`).send({name: nullValue});
            expect(responseNull.statusCode).toBe(400);

            const undefinedValue = undefined;
            const responseUndefined = await request(app).put(`${routePath}/${nameOfUser}`).send({name: undefinedValue});
            expect(responseUndefined.statusCode).toBe(400);

            const response = await request(app).get(`${routePath}/${nameOfUser}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.userName).toBe(nameOfUser);
        });

        test('should not update, user does not exist', async()=>{
            const nameOfUser = 'John Doe';
            const response = await request(app).put(`${routePath}/${nameOfUser}`).send({name: 'Mickey Mouse'});
            expect(response.statusCode).toBe(400);
        })

        test('should not update, new name is already in use', async()=>{
            const nameOfUser = 'John Doe';
            const nameOfUser2 = 'Mickey';

            await request(app).post(routePath).send({username: nameOfUser});
            await request(app).post(routePath).send({username: nameOfUser2});
            const response = await request(app).put(`${routePath}/${nameOfUser}`).send({name: nameOfUser2});

            expect(response.statusCode).toBe(400);

        })
    })

});
describe('GET /api/user', () => {

    describe('/', ()=>{
        test('should return not found for no users', async () => {
            const response = await request(app).get(`${routePath}`);
            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);

        });
        test('should return two users', async () => {

            const validUsername = 'Jeremy Meier';
            const otherValidUsername = 'Franklin Saint';

            expect(await request(app).post(routePath).send({username: validUsername})).toBeTruthy();
            expect(await request(app).post(routePath).send({username: otherValidUsername})).toBeTruthy();
            const expectedUser = {
                username: validUsername,
            };
            const otherExpectedUser = {
                username: otherValidUsername,
            };


            const response = await request(app).get(`/api/user/`);

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body[1].userName).toEqual(otherExpectedUser.username);
            expect(response.body[0].userName).toEqual(expectedUser.username);

        });

    })

    describe('/:username', ()=>{
        test('should return 400 for a username that is too short', async () => {

            const username = 'x'; // Assuming this ID does not exist
            const response = await request(app).get(`${routePath}/${username}`);
            expect(response.statusCode).toBe(400);
        });

        test('should return 400 for a bad request (username too long)', async () => {
            const invalidUserName = 'invalid is way too long to be a username, validation should return bad requeset'; // Invalid ID format
            const response = await request(app).get(`${routePath}/${invalidUserName}`);
            expect(response.statusCode).toBe(400);
        });

        test('should return 400 for a bad request, because user does not exist', async () => {
            const username = 'userdoesnotexist';
            const response = await request(app).get(`${routePath}/${username}`);
            expect(response.statusCode).toBe(400);
        })

        test('should return a user in json format for an existing user', async () => {
            const validUsername = 'Jeremy Meier';

            await request(app).post(routePath).send({username: validUsername});
            const expectedUser = {
                id: 1,
                username: validUsername,
                profilePic: 'not relevant'
            };


            const response = await request(app).get(`/api/user/${validUsername}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.userName).toEqual(expectedUser.username);
        });
    })
});

describe('DELETE /api/user', () => {

    describe('/:username', ()=>{
        test('should return 400 for a username that is too short', async () => {
            const username = 'x'; // Assuming this ID does not exist
            const response = await request(app).delete(`${routePath}/${username}`);
            expect(response.statusCode).toBe(400);
        });
        test('should return 400 for a bad request (username too long)', async () => {
            const invalidUserName = 'invalid is way too long to be a username, validation should return bad requeset'; // Invalid ID format
            const response = await request(app).delete(`${routePath}/${invalidUserName}`);
            expect(response.statusCode).toBe(400);
        });
        test('should return 400 for a bad request, because user does not exist', async ()=>{
            const username = 'userdoesnotexist';
            const response = await request(app).delete(`${routePath}/${username}`);
            expect(response.statusCode).toBe(400);
        });
        test('should return 400 for a bad request, because null was given', async ()=>{
            const username = null;
            const response = await request(app).delete(`${routePath}/${username}`);
            expect(response.statusCode).toBe(400);
        });
        test('should return 400 for a bad request, because undefined was given', async ()=>{
            const username = undefined;
            const response = await request(app).delete(`${routePath}/${username}`);
            expect(response.statusCode).toBe(400);
        });
        test('should return 204 for a known username, now deleted', async () => {
            const username = 'testadmintodelete';

            let response = await request(app).post(routePath).send({username: username});
            expect(response.statusCode).toBe(201);
            response = await request(app)
                .put(`${routePath}/${username}/avatar`)
                .attach('avatar', path.join(__dirname, '../Download.jpeg')); // Adjust the path to the avatar image file
            expect(response.statusCode).toBe(200);
            expect(fsSync.existsSync(getAvatarPath(username))).toBe(true);
            response = await request(app).delete(`${routePath}/${username}`);
            expect(response.statusCode).toBe(204);
            expect(fsSync.existsSync(getAvatarPath(username))).toBe(false);
            expect(fsSync.existsSync(getUserPath(username))).toBe(false);
        })
    })
});