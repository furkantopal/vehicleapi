import MongoClient from 'mongodb';

import { MongoDbClient } from '../../src/client/mongoDbClient';

/*const mockConnect = jest.fn();
const mockDb = jest.fn();
const mockClose = jest.fn();

jest.mock('MongoClient', () => ({
  MongoClient: function () {
    return {
      connect: mockConnect,
      db: mockDb,
      close: mockClose,
    };
  },
}));
const mockCollection = jest.fn();

mockConnect.mockResolvedValue({
  collection: mockCollection,
});

const mockCreateIndex = jest.fn();

mockCollection.mockResolvedValue({
  createIndex: mockCreateIndex,
});
*/

describe('MongoDbClient', () => {
  beforeAll(async () => {});

  it.skip('should return vehicle collection', async () => {
    const mongoDbClient = new MongoDbClient();
    expect(await mongoDbClient.getVehicleCollection()).toEqual('');
  });
});
