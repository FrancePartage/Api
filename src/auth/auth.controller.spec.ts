import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { Test } from "@nestjs/testing";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
    })
    .useMocker((token) => {
      if (token === AuthService) {
        const signinLocalResult = {
          accessToken: '01cf24d6a8422e8ee7ff61015fc265a2f4d2af11098a0af71882586a835b70ed',
          refreshToken: '39289fc29a276689985405f95b5cb641a6e27dd5db2d450cc6ac213429d0f063'
        }

        return { 
          signinLocal: signinLocalResult
        };
      }
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      }
    })
    .compile();
    
    controller = moduleRef.get(AuthController);
  });

  it('should return user auth tokens', async () => {

  });
});