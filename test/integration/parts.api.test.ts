import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import db from '../../src/models/index.js';
import app from '../../src/app.js';
import request from 'supertest';
import crypto from 'crypto';
import { QueryPaginationDto } from '../../src/schemas/common.schema.js';
import { CreatePartsDto, UpdatePartDto } from '../../src/schemas/part.schema.js';
import { Part } from '../../src/models/part.model.js';
import { up as partsSeedUp } from '../../database/seeders/20260221164424-demo-parts.cjs';

describe('Parts API Integration Tests', () => {
   let validAccessToken: string;

   beforeAll(async () => {
      await db.sequelize.authenticate();

      await db.sequelize.sync({ force: true });

      const authRes = await request(app).post('/api/v1/auth/register').send({
         username: 'AdminUser',
         password: 'StrongPassword123!',
         confirmPassword: 'StrongPassword123!',
      });
      validAccessToken = authRes.body.accessToken;
   });

   afterAll(async () => {
      await db.sequelize.close();
   });

   beforeEach(async () => {
      await db.Part.destroy({ where: {} });
      await partsSeedUp(db.sequelize.getQueryInterface(), db.Sequelize);
   });

   describe('GET api/v1/parts', () => {
      it('should return all existing parts with pagination', async () => {
         const queryParams: QueryPaginationDto = { limit: 5, offset: 0, sort: 'ASC' };

         const expectedParts = await db.Part.findAll({
            order: [['name', queryParams.sort]],
            limit: queryParams.limit,
            offset: queryParams.offset,
         });

         const res = await request(app).get('/api/v1/parts').query(queryParams);

         expect(res.status).toBe(200);
         expect(res.body.status).toBe('success');
         expect(res.body.data.length).toBeLessThanOrEqual(queryParams.limit);
         expect(res.body.data).toEqual(expectedParts.map(part => part.toJSON()));
      });

      it('should return 400 if send invalid query params', async () => {
         const queryParams = { limit: -2, offset: -3, sort: 'INVALID' };

         const res = await request(app).get('/api/v1/parts').query(queryParams);

         expect(res.status).toBe(400);
         expect(res.body.status).toBe('fail');
      });
   });

   describe('GET api/v1/parts/:id', () => {
      it('should return part by valid id', async () => {
         const existingPart = await db.Part.findOne();

         const res = await request(app).get(`/api/v1/parts/${existingPart!.id}`);

         expect(res.status).toBe(200);
         expect(res.body.status).toBe('success');
         expect(res.body.data.id).toEqual(existingPart!.id);
      });

      it('should return 404 if part not found', async () => {
         const fakeUUID = crypto.randomUUID();
         const res = await request(app).get(`/api/v1/parts/${fakeUUID}`);

         expect(res.status).toBe(404);
         expect(res.body.status).toBe('fail');
      });

      it('should return 400 if id is not a valid UUID', async () => {
         const res = await request(app).get(`/api/v1/parts/not-a-uuid`);

         expect(res.status).toBe(400);
      });
   });

   describe('POST api/v1/parts', () => {
      it('should create multiple parts (Bulk Create)', async () => {
         const partsData: CreatePartsDto = [
            {
               name: 'HMX Macchiato',
               price: 25,
               type: 'switch',
               specs: {
                  switchType: 'Linear',
                  pins: '5-pin',
                  actuationForce: 42,
                  travelDistance: 3.6,
               },
            },
         ];

         const res = await request(app)
            .post('/api/v1/parts')
            .send(partsData)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(201);
         expect(res.body.status).toBe('success');
         expect(res.body.data).toHaveLength(1);
         expect(res.body.data[0].name).toEqual(partsData[0].name);

         const savedSwitch = await db.Part.findOne({ where: { name: 'HMX Macchiato' } });
         expect(savedSwitch).not.toBeNull();
      });

      it('should return 400 if send invalid body', async () => {
         const invalidPartsData = [{ name: 'Cheap Switch', price: -5, type: 'switch' }];

         const res = await request(app)
            .post('/api/v1/parts')
            .send(invalidPartsData)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(400);
         expect(res.body.status).toBe('fail');
      });
   });

   describe('PATCH api/v1/parts/:id', () => {
      let partToUpdate: Part;

      beforeEach(async () => {
         partToUpdate = (await db.Part.findOne({ where: { type: 'switch' } }))!;
      });

      it('should patch part successfully', async () => {
         const updateData: UpdatePartDto = {
            type: 'switch',
            price: 999,
            name: 'Updated HMX Violet',
         };

         const res = await request(app)
            .patch(`/api/v1/parts/${partToUpdate.id}`)
            .send(updateData)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(200);
         expect(Number(res.body.data.price)).toEqual(updateData.price);
         expect(res.body.data.name).toEqual(updateData.name);

         const updatedInDb = await db.Part.findByPk(partToUpdate.id);
         expect(Number(updatedInDb?.price)).toEqual(updateData.price);
      });

      it('should return 400 if type is missing in update body', async () => {
         const invalidUpdate = { price: 50 };

         const res = await request(app)
            .patch(`/api/v1/parts/${partToUpdate.id}`)
            .send(invalidUpdate)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(400);
      });
   });

   describe('DELETE api/v1/parts/:id', () => {
      it('should delete part successfully', async () => {
         const partToDelete = await db.Part.findOne();

         const res = await request(app)
            .delete(`/api/v1/parts/${partToDelete!.id}`)
            .set('Authorization', `Bearer ${validAccessToken}`);

         expect(res.status).toBe(204);

         const checkDb = await db.Part.findByPk(partToDelete!.id);
         expect(checkDb).toBeNull();
      });
   });
});
