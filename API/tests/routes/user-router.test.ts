import request from 'supertest';
import { app } from '../../src/app';
import {StatusCodes} from "http-status-codes";

import user from "../../src/data/models/User";
import * as path from "node:path";


const routePath = '/api/user';


describe('user route', ()=>{

    beforeEach(async ()=>{
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
    describe('PUT /api/user/:username/avatar', () => {
        test('should update the avatar of a user', async () => {

            const username = 'Van Gogh';

            await request(app).post(routePath).send({name: username});
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
            await request(app).post(routePath).send({name: username});
            const response = await request(app)
                .put(`${routePath}/${username}/avatar`);

            expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
        });
    });
    describe('GET /api/user/', () => {
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

            await request(app).post(routePath).send({name: validUsername});
            const expectedUser = {
                id: 1,
                username: validUsername,
                profilePic: 'not relevant'
            };


            const response = await request(app).get(`/api/user/${validUsername}`);
            console.log(response.body);

            expect(response.statusCode).toBe(200);
            expect(response.body.userName).toEqual(expectedUser.username);
        });


        test('should return two users', async () => {

            const validUsername = 'Jeremy Meier';
            const otherValidUsername = 'Franklin Saint';

            await request(app).post(routePath).send({name: validUsername});
            await request(app).post(routePath).send({name: otherValidUsername});
            const expectedUser = {
                username: validUsername,
            };
            const otherExpectedUser = {
                username: otherValidUsername,
            };


            const response = await request(app).get(`/api/user/`);
            console.log(response.body);

            expect(response.statusCode).toBe(200);
            expect(response.body[1].userName).toEqual(otherExpectedUser.username);
            expect(response.body[0].userName).toEqual(expectedUser.username);

        });



    });
    describe('DELETE /api/user/:username', () => {

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

            await request(app).post(routePath).send({name: username});
            const response = await request(app).delete(`${routePath}/${username}`);
            expect(response.statusCode).toBe(204);
        })
    });
})