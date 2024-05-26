import request from 'supertest';
import {app} from '../../src/app';
import {StatusCodes} from "http-status-codes";

import user from "../../src/data/models/User";
import * as path from "node:path";


const routePath = '/api/level';
