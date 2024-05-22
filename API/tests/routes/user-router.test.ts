import request from 'supertest';
import { app } from '../../src/app'; // Adjust the import path according to your project structure
import "../database/database.mock";

describe('GET /api/user/:id', () => {
    test('should return 400 for a non-existing user', async () => {

        const nonExistingUserId = 999; // Assuming this ID does not exist
        const response = await request(app).get(`/api/user/${nonExistingUserId}`);
        expect(response.statusCode).toBe(400);
    });

    test('should return 400 for a bad request (invalid ID format)', async () => {
        const invalidId = 'invalid'; // Invalid ID format
        const response = await request(app).get(`/api/user/${invalidId}`);
        expect(response.statusCode).toBe(400);
    });
    
    test('should return 200 for an existing user', async () => {
        const response = await request(app).get('/api/user/1');
        expect(response.statusCode).toBe(200);
    });
    
    
    
});
