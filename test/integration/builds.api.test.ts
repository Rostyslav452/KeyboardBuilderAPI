import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import db from '../../src/models/index.js';
import app from '../../src/app.js';
import request, { Response } from 'supertest';
import { QueryPaginationDto } from '../../src/schemas/common.schema.js';
import { up as partsSeedUp } from '../../database/seeders/20260221164424-demo-parts.cjs';
import { up as buildsSeedUp } from '../../database/seeders/20260402120001-demo-builds.cjs';
import { up as usersSeedUp } from '../../database/seeders/20260402120000-demo-users.cjs';
import { CreateBuildDto, UpdateBuildDto } from '../../src/schemas/build.schema.js';
import { Build } from '../../src/models/build.model.js';
import { Op } from 'sequelize';

describe('Builds API Integration Tests', () => {
   let testParts: { switchId: string; caseId: string; pcbId: string; keycapId: string };
   let authRes: Response;
   const registerData = {
      username: 'John',
      password: 'Test1234',
      confirmPassword: 'Test1234',
   };
   let validAccessToken: string;

   beforeAll(async () => {
      await db.sequelize.authenticate();
      await db.sequelize.sync({ force: true });

      await partsSeedUp(db.sequelize.getQueryInterface(), db.Sequelize);
      await usersSeedUp(db.sequelize.getQueryInterface(), db.Sequelize);

      authRes = await request(app).post('/api/v1/auth/register').send(registerData);

      validAccessToken = authRes.body.accessToken;

      const switchPart = await db.Part.findOne({ where: { type: 'switch' } });
      const casePart = await db.Part.findOne({ where: { type: 'case' } });
      const pcbPart = await db.Part.findOne({ where: { type: 'pcb' } });
      const keycapPart = await db.Part.findOne({ where: { type: 'keycap' } });

      testParts = {
         switchId: switchPart!.id,
         caseId: casePart!.id,
         pcbId: pcbPart!.id,
         keycapId: keycapPart!.id,
      };
   });

   afterAll(async () => {
      await db.sequelize.close();
   });

   beforeEach(async () => {
      await db.Build.destroy({ where: {} });
   });

   describe('GET api/v1/builds', () => {
      beforeEach(async () => {
         await buildsSeedUp(db.sequelize.getQueryInterface(), db.Sequelize);
      });

      it('should return all existing builds', async () => {
         const queryParams: QueryPaginationDto = { limit: 5, offset: 0, sort: 'ASC' };

         const allBuilds = await db.Build.findAll({
            attributes: { exclude: ['username'] },
            include: [
               { model: db.Part, as: 'keyboardSwitch' },
               { model: db.Part, as: 'keyboardCase' },
               { model: db.Part, as: 'keyboardPCB' },
               { model: db.Part, as: 'keyboardKeycap' },
            ],
            order: [['name', queryParams.sort]],
            limit: queryParams.limit,
            offset: queryParams.offset,
         });

         const res = await request(app).get('/api/v1/builds').query(queryParams);

         expect(res.status).toBe(200);
         expect(res.body.status).toBe('success');

         const expectedBuilds = allBuilds.map(build => build.toJSON());
         expect(res.body.data).toEqual(expectedBuilds);
      });

      it('should return 400 if send invalid query params', async () => {
         const queryParams = { limit: -2, offset: -3, sort: 'SOME_VALUE' };

         const res = await request(app).get('/api/v1/builds').query(queryParams);

         expect(res.status).toBe(400);
         expect(res.body.status).toBe('fail');
      });
   });

   describe('GET api/v1/builds/id', () => {
      let existedBuild: Build;

      beforeEach(async () => {
         const buildData: CreateBuildDto = {
            name: 'My Awesome Build',
            switchId: testParts.switchId,
            caseId: testParts.caseId,
            pcbId: testParts.pcbId,
            keycapId: testParts.keycapId,
         };

         const res = await request(app)
            .post('/api/v1/builds')
            .send(buildData)
            .set('Authorization', `Bearer ${validAccessToken}`);

         existedBuild = res.body.data;
      });

      it('should return build by id', async () => {
         const res = await request(app).get(`/api/v1/builds/${existedBuild.id}`);

         expect(res.status).toBe(200);
         expect(res.body.status).toBe('success');

         expect(res.body.data.id).toEqual(existedBuild.id);
      });

      it('should return 400 if build id is not a valid UUID', async () => {
         const res = await request(app).get(`/api/v1/builds/${'FAKE_ID'}`);

         expect(res.status).toBe(400);
         expect(res.body.status).toBe('fail');
      });
   });

   describe('GET api/v1/builds/me', () => {
      let existedBuild: Build;

      beforeEach(async () => {
         const buildData: CreateBuildDto = {
            name: 'My Awesome Build',
            switchId: testParts.switchId,
            caseId: testParts.caseId,
            pcbId: testParts.pcbId,
            keycapId: testParts.keycapId,
         };

         const res = await request(app)
            .post('/api/v1/builds')
            .send(buildData)
            .set('Authorization', `Bearer ${validAccessToken}`);

         existedBuild = res.body.data;
      });

      it('should return all builds by user', async () => {
         const res = await request(app)
            .get(`/api/v1/builds/me`)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(200);
         expect(res.body.status).toBe('success');

         expect(res.body.data).toEqual([existedBuild]);
      });

      it('should return 403 if user isn`t authorized', async () => {
         const res = await request(app)
            .get(`/api/v1/builds/me`)
            .set('Authorization', `Bearer ${'FAKE_TOKEN'}`);

         expect(res.status).toBe(401);
         expect(res.body.status).toBe('fail');
      });
   });

   describe('POST api/v1/builds', () => {
      it('should create build', async () => {
         const buildData: CreateBuildDto = {
            name: 'My Awesome Build',
            switchId: testParts.switchId,
            caseId: testParts.caseId,
            pcbId: testParts.pcbId,
            keycapId: testParts.keycapId,
         };

         const res = await request(app)
            .post('/api/v1/builds')
            .send(buildData)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(201);
         expect(res.body.status).toBe('success');
         expect(res.body.data.name).toEqual(buildData.name);

         const buildInDb = await db.Build.findByPk(res.body.data.id);

         expect(buildInDb).not.toBeNull();
      });

      it('should return 400 if send invalid body', async () => {
         const buildData: CreateBuildDto = {
            name: 'My Awesome Build',
            switchId: 'Fake_ID',
            caseId: testParts.caseId,
            pcbId: testParts.pcbId,
            keycapId: testParts.keycapId,
         };

         const res = await request(app)
            .post('/api/v1/builds')
            .send(buildData)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(400);
         expect(res.body.status).toBe('fail');
      });
   });

   describe('PATCH api/v1/builds', () => {
      let existedBuild: Build;

      beforeEach(async () => {
         const buildData: CreateBuildDto = {
            name: 'My Awesome Build',
            switchId: testParts.switchId,
            caseId: testParts.caseId,
            pcbId: testParts.pcbId,
            keycapId: testParts.keycapId,
         };

         const res = await request(app)
            .post('/api/v1/builds')
            .send(buildData)
            .set('Authorization', `Bearer ${validAccessToken}`);

         existedBuild = res.body.data;
      });

      it('should patch build', async () => {
         const anotherSwitch = await db.Part.findOne({
            where: { type: 'switch', id: { [Op.not]: testParts.switchId } },
         });

         const updateBuild: UpdateBuildDto = {
            name: 'My Test1234',
            switchId: anotherSwitch!.id,
         };

         const res = await request(app)
            .patch(`/api/v1/builds/${existedBuild.id}`)
            .send(updateBuild)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(200);
         expect(res.body.status).toBe('success');
         expect(res.body.data.switchId).toEqual(updateBuild.switchId);
         expect(res.body.data.name).toEqual(updateBuild.name);

         const buildInDb = await db.Build.findByPk(res.body.data.id);

         expect(buildInDb?.switchId).toEqual(updateBuild.switchId);
         expect(buildInDb?.name).toEqual(updateBuild.name);
      });

      it('should return 400 if send invalid body', async () => {
         const updateBuild: UpdateBuildDto = {
            name: 'My Test1234',
            switchId: 'FAKE_ID',
         };

         const res = await request(app)
            .patch(`/api/v1/builds/${existedBuild.id}`)
            .send(updateBuild)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(400);
         expect(res.body.status).toBe('fail');
      });
   });

   describe('DELETE api/v1/builds', () => {
      let existedBuild: Build;

      beforeEach(async () => {
         const buildData: CreateBuildDto = {
            name: 'My Awesome Build',
            switchId: testParts.switchId,
            caseId: testParts.caseId,
            pcbId: testParts.pcbId,
            keycapId: testParts.keycapId,
         };

         const res = await request(app)
            .post('/api/v1/builds')
            .send(buildData)
            .set('Authorization', `Bearer ${validAccessToken}`);

         existedBuild = res.body.data;
      });

      it('should delete build', async () => {
         const res = await request(app)
            .delete(`/api/v1/builds/${existedBuild.id}`)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(204);

         const buildInDb = await db.Build.findByPk(existedBuild.id);

         expect(buildInDb).toBeNull();
      });

      it('should return 403 if build doesn`t belong to user', async () => {
         const authDeleteRes = await request(app)
            .post('/api/v1/auth/register')
            .send({ ...registerData, username: 'deleteTest' });

         const deleteAccessToken = authDeleteRes.body.accessToken;

         const res = await request(app)
            .delete(`/api/v1/builds/${existedBuild.id}`)
            .set('Authorization', `Bearer ${deleteAccessToken}`);

         expect(res.status).toBe(403);
         expect(res.body.status).toBe('fail');

         const buildInDb = await db.Build.findByPk(existedBuild.id);

         expect(buildInDb).not.toBeNull();
      });
   });
});
