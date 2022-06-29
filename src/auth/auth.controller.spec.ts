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
        return { 
          
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