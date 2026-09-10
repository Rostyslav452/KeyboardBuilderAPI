import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { type Build } from '../models/build.model.js';
import db from '../models/index.js';
import buildService from './build.service.js';
import AppError from '../core/AppError.js';
import { QueryPaginationDto } from '../schemas/common.schema.js';
import { CreateBuildDto, UpdateBuildDto } from '../schemas/build.schema.js';

jest.mock('../models/index.js', () => ({
   Part: {},
   Build: {
      findByPk: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
   },
}));

const mockBuildsList = [
   {
      id: '11111111-2222-3333-4444-555555555555',
      name: 'My First Silent Build',
      username: 'test_user',
      switchId: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      caseId: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      pcbId: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
      keycapId: 'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
   },
   {
      id: '66666666-7777-8888-9999-000000000000',
      name: 'Budget Clicky Setup',
      username: 'test_user',
      switchId: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      caseId: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      pcbId: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
      keycapId: 'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
   },
] as unknown as Build[];

describe('Build service tests', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it('getBuildById should return build', async () => {
      const fakeBuild = mockBuildsList[0];
      jest.mocked(db.Build.findByPk).mockResolvedValue(fakeBuild);

      const result = await buildService.getBuildById(fakeBuild.id);

      expect(result).toEqual(fakeBuild);
      expect(db.Build.findByPk).toHaveBeenCalledTimes(1);
      expect(db.Build.findByPk).toHaveBeenCalledWith(fakeBuild.id, expect.any(Object));
   });

   it('getBuildById should throw 404 if build doesn`t exist', async () => {
      const nonExistentId = 'non-existent-id';
      jest.mocked(db.Build.findByPk).mockResolvedValue(null);

      const promise = buildService.getBuildById(nonExistentId);

      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toMatchObject({ statusCode: 404 });
   });

   it('getAllBuilds should return all builds', async () => {
      const queryParams: QueryPaginationDto = { limit: 2, offset: 0, sort: 'ASC' };
      jest.mocked(db.Build.findAll).mockResolvedValue(mockBuildsList);

      const result = await buildService.getAllBuilds(queryParams);

      expect(result).toEqual(mockBuildsList);
      expect(db.Build.findAll).toHaveBeenCalledTimes(1);
      expect(db.Build.findAll).toHaveBeenCalledWith(
         expect.objectContaining({ limit: 2, offset: 0 }),
      );
   });

   it('getBuildsByUser should return builds for specific user', async () => {
      const username = 'test_user';
      jest.mocked(db.Build.findAll).mockResolvedValue(mockBuildsList);

      const result = await buildService.getBuildsByUser(username);

      expect(result).toEqual(mockBuildsList);
      expect(db.Build.findAll).toHaveBeenCalledWith(
         expect.objectContaining({ where: { username } }),
      );
   });

   it('getBuildsByUser should throw 404 if user has no builds', async () => {
      jest.mocked(db.Build.findAll).mockResolvedValue([]);

      const promise = buildService.getBuildsByUser('empty_user');

      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toMatchObject({ statusCode: 404 });
   });

   it('createBuild should create and return new build', async () => {
      const fakeId = '12345';
      const fakeUsername = 'test_user';
      const fakeBody: CreateBuildDto = {
         name: 'Budget Clicky Setup',
         switchId: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
         caseId: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
         pcbId: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
         keycapId: 'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
      };
      const newBuild = { id: fakeId, ...fakeBody, username: fakeUsername } as unknown as Build;

      jest.mocked(db.Build.create).mockResolvedValue(newBuild);
      jest.mocked(db.Build.findByPk).mockResolvedValueOnce(newBuild);

      const result = await buildService.createBuild(fakeBody, fakeUsername);

      expect(result).toEqual(newBuild);
      expect(db.Build.create).toHaveBeenCalledWith({ ...fakeBody, username: fakeUsername });
   });

   it('updateBuild should update existing build', async () => {
      const fakeBuild = mockBuildsList[0];
      const updateData: UpdateBuildDto = { name: 'Updated Silent Build' };
      const updatedBuild = {
         ...fakeBuild,
         ...updateData,
      } as Build;

      const fakeBuildInstance = {
         ...fakeBuild,
         update: jest.fn<() => Promise<Build>>().mockResolvedValue(updatedBuild),
      } as unknown as Build;

      jest
         .mocked(db.Build.findByPk)
         .mockResolvedValueOnce(fakeBuildInstance)
         .mockResolvedValueOnce(updatedBuild);

      const result = await buildService.updateBuild(fakeBuild.id, updateData, fakeBuild.username);

      expect(result.name).toBe(updateData.name);
      expect(fakeBuildInstance.update).toHaveBeenCalledTimes(1);
      expect(fakeBuildInstance.update).toHaveBeenCalledWith(updateData);
   });

   it('updateBuild should throw 403 if user is not the owner', async () => {
      const fakeBuild = mockBuildsList[0];
      const fakeBuildInstance = { ...fakeBuild } as unknown as Build;

      jest.mocked(db.Build.findByPk).mockResolvedValue(fakeBuildInstance);

      const promise = buildService.updateBuild(fakeBuild.id, { name: 'Hack' }, 'wrong_user');

      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toMatchObject({ statusCode: 403 });
   });

   it('deleteBuild should delete build', async () => {
      const fakeBuild = mockBuildsList[0];
      const fakeBuildInstance = {
         ...fakeBuild,
         destroy: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      } as unknown as Build;

      jest.mocked(db.Build.findByPk).mockResolvedValue(fakeBuildInstance);

      const result = await buildService.deleteBuild(fakeBuild.id, fakeBuild.username);

      expect(result).toBeUndefined();
      expect(fakeBuildInstance.destroy).toHaveBeenCalledTimes(1);
   });

   it('deleteBuild should throw 403 if user is not the owner', async () => {
      const fakeBuild = mockBuildsList[0];
      const fakeBuildInstance = { ...fakeBuild } as unknown as Build;

      jest.mocked(db.Build.findByPk).mockResolvedValue(fakeBuildInstance);

      const promise = buildService.deleteBuild(fakeBuild.id, 'wrong_user');

      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toMatchObject({ statusCode: 403 });
   });
});
