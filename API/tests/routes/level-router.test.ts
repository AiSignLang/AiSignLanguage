
import request from 'supertest';

import {app} from '../../src/app';
import {StatusCodes} from "http-status-codes";
import Level from "../../src/data/models/Level";


describe('Level Router', () => {
    it('GET / - returns all levels', async () => {
        
        const res = await request(app).get('/api/level');
        expect(res.statusCode).toEqual(StatusCodes.OK);
    });

    it('GET /:levelId - returns level if exists', async () => {
        const level = await Level.create({});
        const res = await request(app).get(`/api/level/${level.id}`);
        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toHaveProperty('id', level.id);
    });

    it('GET /:levelId - returns 400 if level does not exist', async () => {
        const res = await request(app).get('/api/level/12345');
        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('DELETE /:levelId - deletes level if exists', async () => {
        const level = await Level.create({ });
        const res = await request(app).delete(`/api/level/${level.id}`);
        expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it('DELETE /:levelId - returns 400 if level does not exist', async () => {
        const res = await request(app).delete('/api/level/12345');
        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });
});
