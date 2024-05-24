import request from 'supertest';
import { app } from '../../src/app';
import supertest from "supertest";
import {StatusCodes} from "http-status-codes"; // Adjust the import path according to your project structure


const path = '/api/user';

describe('POST /api/user', () => {
    test('should create a new user', async () => {
        const response = await request(app)
            .post(path)
            .send({
                name: 'John Doe'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.userName).toBe('John Doe');
    });

    test('should not create a user with the same name', async () => {
        const response = await request(app)
            .post(path)
            .send({
                name: 'John Doe'
            });
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});

describe('PUT /api/user/:username/avatar', () => {
    test('should update the avatar of a user', async () => {
        const username = 'John Doe';
        const response = await request(app)
            .put(`${path}/${username}/avatar`)
            .attach('avatar', '../Download.jpeg'); // Adjust the path to the avatar image file

        expect(response.statusCode).toBe(200);
        expect(response.body.profilePic).toBeDefined();
    });

    test('should not update the avatar if the user does not exist', async () => {
        const username = 'NonExistentUser';
        const response = await request(app)
            .put(`${path}/${username}/avatar`)
            .attach('avatar', '../Download.jpeg'); // Adjust the path to the avatar image file

        expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test('should not update the avatar if no file is provided', async () => {
        const username = 'John Doe';
        const response = await request(app)
            .put(`${path}/${username}/avatar`);

        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});


// Mock the Users model findOne method

describe('GET /api/user/:id', () => {
    test('should return 400 for a username that is too short', async () => {

        const username = 'x'; // Assuming this ID does not exist
        const response = await request(app).get(`${path}/${username}`);
        expect(response.statusCode).toBe(400);
    });

    test('should return 400 for a bad request (username too long)', async () => {
        const invalidUserName = 'invalid is way too long to be a username, validation should return bad requeset'; // Invalid ID format
        const response = await request(app).get(`${path}/${invalidUserName}`);
        expect(response.statusCode).toBe(400);
    });

    test('should return 400 for a bad request, because user does not exist', async ()=>{
        const username = 'userdoesnotexist';
        const response = await request(app).get(`${path}/${username}`);
        expect(response.statusCode).toBe(400);
    })

    test('should return a user in json format for a known username', async () => { // TODO: mock does not work
        const validUsername = 'validUsername';
        const expectedUser = {
            id: 1,
            username: validUsername,
            profilePic: 'path/to/pic.jpg'
        };

        const response = await request(app).get(`/api/user/${validUsername}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expectedUser);
    });
});

describe('GET /api/user', ()=>{

    // TODO: get all users
    test('should return 204 and a user object', async () => {
        const response = await request(app).get(path);
        expect(response.statusCode).toBe(204);
    })

    // TODO: mock does not work, also one test for server crash needed
})

