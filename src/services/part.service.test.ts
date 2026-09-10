import AppError from '../core/AppError.js';
import db from '../models/index.js';
import { Part } from '../models/part.model.js';
import { QueryPaginationDto } from '../schemas/common.schema.js';
import { CreatePartsDto, UpdatePartDto } from '../schemas/part.schema.js';
import partService from './part.service.js';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('../models/index', () => ({
   Part: {
      findByPk: jest.fn(),
      findAll: jest.fn(),
      bulkCreate: jest.fn(),
   },
}));

const mockPartsList = [
   {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      name: 'Gateron Oil King',
      type: 'switch',
      price: 0.65,
      specs: {
         switchType: 'linear',
         actuationForce: 55,
         bottomOutForce: 65,
         travelDistance: 4.0,
         pinCount: 5,
      },
   },
   {
      id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      name: 'Tofu60 2.0 Aluminum Case',
      type: 'case',
      price: 110.0,
      specs: {
         material: 'aluminum',
         formFactor: '60%',
         weightGrams: 950,
         mountingStyle: 'gasket',
      },
   },
   {
      id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
      name: 'DZ60RGB V2 Hot-swap PCB',
      type: 'pcb',
      price: 58.0,
      specs: {
         hotSwap: true,
         rgb: true,
         layoutSupport: 'ANSI',
         firmware: 'QMK/VIA',
         connectionType: 'USB-C',
      },
   },
   {
      id: 'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
      name: 'PBTfans Retro Dark Lights Base Kit',
      type: 'keycap',
      price: 75.0,
      specs: {
         profile: 'Cherry',
         material: 'PBT',
         printingMethod: 'doubleshot',
         keysCount: 142,
      },
   },
] as unknown as Part[];

describe('Part service tests', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it('getPartById should return part', async () => {
      const fakePart = mockPartsList[0];
      jest.mocked(db.Part.findByPk).mockResolvedValue(fakePart);

      const result = await partService.getPartById(fakePart.id);

      expect(result).toEqual(fakePart);
      expect(db.Part.findByPk).toHaveBeenCalledTimes(1);
      expect(db.Part.findByPk).toHaveBeenCalledWith(fakePart.id);
   });

   it('getPartById should return 404 if part doesn`t exist', async () => {
      const notExistedId = 'non-existent-id';
      jest.mocked(db.Part.findByPk).mockResolvedValue(null);

      const promise = partService.getPartById(notExistedId);

      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toMatchObject({
         message: 'Part with ID non-existent-id not found',
         statusCode: 404,
      });
      expect(db.Part.findByPk).toHaveBeenCalledWith(notExistedId);
   });

   it('getAllParts should return all part', async () => {
      const queryParams: QueryPaginationDto = { limit: 2, offset: 0, sort: 'ASC' };

      jest.mocked(db.Part.findAll).mockResolvedValue(mockPartsList);

      const result = await partService.getAllParts(queryParams);

      expect(result).toEqual(mockPartsList);

      expect(db.Part.findAll).toHaveBeenCalledTimes(1);
      expect(db.Part.findAll).toHaveBeenCalledWith({
         order: [['name', queryParams.sort]],
         limit: queryParams.limit,
         offset: queryParams.offset,
      });
   });

   it('createParts should create and return new part', async () => {
      const fakeId = '12345';
      const fakeBody: CreatePartsDto = [
         {
            name: 'PBTfans Retro Dark Lights Base Kit',
            type: 'keycap',
            price: 75.0,
            specs: {
               profile: 'Cherry',
               material: 'PBT',
               legends: 'Double-shot',
               language: ['UA', 'UK'],
            },
         },
      ];
      const newPart = { id: fakeId, ...fakeBody } as unknown as Part;
      const createdData = [newPart];

      jest.mocked(db.Part.bulkCreate).mockResolvedValue(createdData);

      const result = await partService.createParts(fakeBody);

      expect(result).toEqual(createdData);

      expect(db.Part.bulkCreate).toHaveBeenCalledTimes(1);
      expect(db.Part.bulkCreate).toHaveBeenCalledWith(fakeBody);
   });

   it('updatePart should update existed part', async () => {
      const fakePart = mockPartsList[0];
      const updateData: UpdatePartDto = {
         type: 'switch',
         price: 110.0,
      };
      const fakePartInstance = {
         ...fakePart,
         update: jest.fn<() => Promise<Part>>().mockResolvedValue({
            ...mockPartsList[0],
            ...updateData,
         } as Part),
      } as unknown as Part;

      jest.mocked(db.Part.findByPk).mockResolvedValue(fakePartInstance);

      const result = await partService.updatePart(fakePart.id, updateData);

      expect(result.price).toBe(updateData.price);

      expect(fakePartInstance.update).toHaveBeenCalledTimes(1);
      expect(fakePartInstance.update).toHaveBeenCalledWith(updateData);
   });

   it('updatePart should throw 404 if trying to update non-existent part', async () => {
      const nonExistentId = 'non-existent-id';
      const updateData: UpdatePartDto = { price: 110.0, type: 'switch' };

      jest.mocked(db.Part.findByPk).mockResolvedValue(null);

      const promise = partService.updatePart(nonExistentId, updateData);

      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toMatchObject({
         message: 'Part with ID non-existent-id not found',
         statusCode: 404,
      });
   });

   it('deletePart should delete part', async () => {
      const fakePart = mockPartsList[0];
      const fakePartInstance = {
         ...fakePart,
         destroy: jest.fn<() => Promise<null>>().mockResolvedValue(null),
      } as unknown as Part;

      jest.mocked(db.Part.findByPk).mockResolvedValue(fakePartInstance);

      const result = await partService.deletePart(fakePart.id);

      expect(result).toBeUndefined();
      expect(fakePartInstance.destroy).toHaveBeenCalledTimes(1);
      expect(fakePartInstance.destroy).toHaveBeenCalledWith();
   });

   it('deletePart should throw 404 if trying to delete non-existent part', async () => {
      const nonExistentId = 'non-existent-id';

      jest.mocked(db.Part.findByPk).mockResolvedValue(null);

      const promise = partService.deletePart(nonExistentId);

      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toMatchObject({
         message: 'Part with ID non-existent-id not found',
         statusCode: 404,
      });
   });
});
