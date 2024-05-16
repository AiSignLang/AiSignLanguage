import request from 'supertest';
import { app } from '../../src/app'; // Adjust the import path according to your project structure


describe('GET /api/user/:id', () => {
    test('should return 404 for a non-existing user', async () => {

        const nonExistingUserId = 999; // Assuming this ID does not exist
        const response = await request(app).get(`/api/user/${nonExistingUserId}`);
        expect(response.statusCode).toBe(404);
    });

    test('should return 400 for a bad request (invalid ID format)', async () => {
        const invalidId = 'invalid'; // Invalid ID format
        const response = await request(app).get(`/api/user/${invalidId}`);
        expect(response.statusCode).toBe(400);
    });
});
