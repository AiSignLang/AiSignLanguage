// In __tests__/user-router.test.ts
import request from 'supertest';
import { app } from '../../src/app'; // Adjust the import path according to your project structure

describe('GET /user/:id', () => {
    it('should return 404 for a non-existing user', async () => {
        const nonExistingUserId = 999; // Assuming this ID does not exist
        const response = await request(app).get(`/user/${nonExistingUserId}`);
        expect(response.statusCode).toBe(404);
    });

    // Add more tests here...
});