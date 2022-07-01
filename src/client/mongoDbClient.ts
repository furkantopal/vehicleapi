import { MongoClient, ServerApiVersion } from 'mongodb';

export class MongoDbClient {
  private mongoClient: MongoClient;

  constructor() {
    let uri = '';
    if (process.env.NODE_ENV === 'development') {
      uri = process.env.MONGODB_DEVELOPMENT_URL!;
    } else {
      uri = process.env.MONGODB_TEST_URL!;
    }

    const mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 };
    this.mongoClient = new MongoClient(uri, mongoClientOptions);
  }

  async getVehicleCollection() {
    this.mongoClient.connect();
    const collection = this.mongoClient.db('Cluster0').collection('vehicle');
    await collection.createIndex(
      { dealerId: 'text' },
      {
        unique: true,
      }
    );
    return collection;
  }

  async getDealerCollection() {
    this.mongoClient.connect();
    const collection = this.mongoClient.db('Cluster0').collection('dealer');
    return collection;
  }

  async close(): Promise<void> {
    await this.mongoClient.close();
  }
}
