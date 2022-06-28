import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { Test } from "@nestjs/testing";
import { UserRole } from "@prisma/client";

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
    })
    .useMocker((token) => {
      if (token === UsersService) {
        const searchAllResult = {
          data: [
            {
              id: 1,
              displayName: 'John Doe',
              role: UserRole.CITIZEN,
              avatar: 'default.png',
              resourcesCount: 0,
              relationsCount: 0,
              requestsCount: 0
            }
          ]
        };

        const findOneResult = {
          id: 1,
          displayName: 'John Doe',
          role: UserRole.CITIZEN,
          avatar: 'default.png',
          resourcesCount: 0,
          relationsCount: 0,
          requestsCount: 0   
        };

        const findAllRelationsResult = {
          data: [
            { id: 2 }, { id: 3 }
          ],
          pagination: {
            currentPage: 1,
            limit: 2,
            pageCount: 4,
            hasNextPage: true,
            hasPreviousPage: false,
            itemsCount: 2
          }
        }

        const findAllFavoritesResult = {
          data: [
            { id: 2 }, { id: 3 }
          ],
          pagination: {
            currentPage: 1,
            limit: 2,
            pageCount: 4,
            hasNextPage: true,
            hasPreviousPage: false,
            itemsCount: 2
          }
        }

        const findAllResourcesResult = {
          data: [
            { id: 2 }, { id: 3 }
          ],
          pagination: {
            currentPage: 1,
            limit: 2,
            pageCount: 4,
            hasNextPage: true,
            hasPreviousPage: false,
            itemsCount: 2
          }
        }

        return { 
          searchAll: jest.fn().mockResolvedValue(searchAllResult),
          findOne: jest.fn().mockResolvedValue(findOneResult),
          findAllRelations: jest.fn().mockResolvedValue(findAllRelationsResult),
          findAllFavorites: jest.fn().mockResolvedValue(findAllFavoritesResult),
          findAllResources: jest.fn().mockResolvedValue(findAllResourcesResult),
        };
      }
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      }
    })
    .compile();
    
    controller = moduleRef.get(UsersController);
  });

  it('should return an array of users', async () => {
      expect((await controller.searchAll({ query: 'John' })).data).toHaveLength(1);
  });

  it('should return a user', async () => {
    expect((await controller.getUserInformation({ userId: `${1}` })).id).toEqual(1);
  });

  it('should check relations pagination', async () => {
    expect((await controller.getRelations({ userId: `${1}` }, { page: 1, limit: 2 })).pagination.currentPage).toEqual(1);
    expect((await controller.getRelations({ userId: `${1}` }, { page: 1, limit: 2 })).pagination.limit).toEqual(2);
  });

  it('should return user relations', async () => {
    expect((await controller.getRelations({ userId: `${1}` }, { page: 1, limit: 2 })).data).toHaveLength(2);
  });

  it('should return user favorites resources', async () => {
    expect((await controller.findAllFavorites(null, { userId: `${1}` }, { page: 1, limit: 2 })).data).toHaveLength(2);
  });

  it('should return user resources', async () => {
    expect((await controller.getResources(null, { userId: `${1}` }, { page: 1, limit: 2 })).data).toHaveLength(2);
  });
});