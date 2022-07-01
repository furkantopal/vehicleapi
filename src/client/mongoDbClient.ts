import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

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

  async getCollection(collectionName: string) {
    this.mongoClient.connect();
    const collection = this.mongoClient.db('Cluster0').collection(collectionName);
    await collection.createIndex(
      { dealerId: 'text' },
      {
        unique: true,
      }
    );
    return collection;
  }

  async getCollectionArray(collectionName: string) {
    const collection = await this.getCollection(collectionName);
    return await collection.find().toArray();
  }

  async insertIntoCollection(collectionName: string, data: any) {
    const collection = await this.getCollection(collectionName);
    const creationDate = new Date().toISOString();
    await collection.insertOne({ dateOfCreation: creationDate, dateOfLastUpdate: creationDate, ...data });
  }

  async deleteFromCollection(collectionName: string, data: string) {
    const collection = await this.getCollection(collectionName);
    await collection.deleteOne({ _id: new ObjectId(data) });
  }

  async findInCollectionWithId(collectionName: string, data: any) {
    const vehicleCollection = await this.getCollection(collectionName);
    return await vehicleCollection.findOne({ _id: new ObjectId(data) });
  }

  async findInCollectionWithOtherIndex(collectionName: string, data: any) {
    const vehicleCollection = await this.getCollection(collectionName);
    return await vehicleCollection.find(data).toArray();
  }

  async updateCollection(collectionName: string, dataId: string, data: any) {
    const collection = await this.getCollection(collectionName);
    const dateOfLastUpdate = new Date().toISOString();
    await collection.updateOne({ _id: new ObjectId(dataId) }, { $set: { ...data, dateOfLastUpdate: dateOfLastUpdate } }, { upsert: false });
  }

  async close(): Promise<void> {
    await this.mongoClient.close();
  }
}
