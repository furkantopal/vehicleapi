import MongoClient from 'mongodb';

import { MongoDbClient } from '../../src/client/mongoDbClient';

//TODO: client unit test
describe('MongoDbClient', () => {
  beforeAll(async () => {});

  it.skip('should return vehicle collection', async () => {
    const mongoDbClient = new MongoDbClient();
    expect(1).toEqual(1);
  });
});
