import * as nock from 'nock';

import { RequestBuilder } from '../src/RequestBuilder';
import { BanksUser } from '../src/core/BanksUser';
import { getFakeAlgoanServer, getOAuthServer } from './utils/fake-server.utils';
import { banksUser as banksUserSample } from './samples/banks-users';

describe('Tests related to the BanksUser class', () => {
  const baseUrl: string = 'http://localhost:3000';
  let banksUserAPI: nock.Scope;
  let requestBuilder: RequestBuilder;

  beforeEach(() => {
    banksUserAPI = getFakeAlgoanServer({
      baseUrl,
      path: '/v1/banks-users/id1',
      response: banksUserSample,
      method: 'get',
    });
    getOAuthServer({
      baseUrl,
      isRefreshToken: false,
      isUserPassword: false,
      nbOfCalls: 1,
      expiresIn: 500,
      refreshExpiresIn: 2000,
    });
    requestBuilder = new RequestBuilder(baseUrl, {
      clientId: 'a',
      clientSecret: 's',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
  });

  describe('static getBanksUserById()', () => {
    it('should get the Banks User account', async () => {
      const banksUser: BanksUser = await BanksUser.getBanksUserById('id1', requestBuilder);
      expect(banksUserAPI.isDone()).toBeTruthy();
      expect(banksUser).toBeInstanceOf(BanksUser);
    });
  });
});
