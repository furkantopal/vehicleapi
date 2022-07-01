import { ObjectId } from 'mongodb';
import { VError } from 'verror';
import { MongoDbClient } from '../client/mongoDbClient';

import { DealerWithoutDates, VehicleWithoutDates } from '../types/vehicle';

export class VehicleRepository {
  mongoDbClient: MongoDbClient;
  constructor() {
    this.mongoDbClient = new MongoDbClient();
  }

  async addVehicle(vehicle: VehicleWithoutDates): Promise<void> {
    try {
      const collection = await this.mongoDbClient.getVehicleCollection();
      const creationDate = new Date().toISOString();
      await collection.insertOne({ dateOfCreation: creationDate, dateOfLastUpdate: creationDate, ...vehicle });
    } catch (error) {
      throw new VError(error as Error, `Add vehicle failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }
  async removeVehicle(vehicleId: string): Promise<void> {
    try {
      const collection = await this.mongoDbClient.getVehicleCollection();
      await collection.deleteOne({ _id: new ObjectId(vehicleId) });
    } catch (error) {
      throw new VError(error as Error, `Remove vehicle failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async getVehicle(vehicleId: string) {
    try {
      const vehicleCollection = await this.mongoDbClient.getVehicleCollection();
      const vehicle = await vehicleCollection.findOne({ _id: new ObjectId(vehicleId) });
      if (!vehicle || vehicle === null) {
        throw new Error('Vehicle not found');
      }
      const dealerCollection = await this.mongoDbClient.getDealerCollection();
      const dealer = await dealerCollection.findOne({ _id: new ObjectId(vehicle.dealer) });
      const vehicleWithDealer = { ...vehicle, dealer: dealer };

      return vehicleWithDealer;
    } catch (error) {
      throw new VError(error as Error, `Get vehicle failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async getAllVehicles() {
    try {
      const collection = await this.mongoDbClient.getVehicleCollection();
      const vehicles = await collection.find().toArray();

      if (!vehicles || vehicles === null) {
        throw new Error('Vehicle not found');
      }

      const dealerCollection = await this.mongoDbClient.getDealerCollection();

      for (const vehicle of vehicles) {
        const dealer = await dealerCollection.findOne({ _id: new ObjectId(vehicle.dealer) });
        const vehicleWithDealer = { ...vehicle, dealer: dealer };
        vehicles[vehicles.indexOf(vehicle)] = { ...vehicleWithDealer };
      }

      return vehicles;
    } catch (error) {
      throw new VError(error as Error, `Get vehicle failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async updateVehicle(vehicleId: string, updatedVehicle: Partial<VehicleWithoutDates>): Promise<void> {
    try {
      const collection = await this.mongoDbClient.getVehicleCollection();
      const dateOfLastUpdate = new Date().toISOString();
      await collection.updateOne(
        { _id: new ObjectId(vehicleId) },
        { $set: { ...updatedVehicle, dateOfLastUpdate: dateOfLastUpdate } },
        { upsert: false }
      );
    } catch (error) {
      throw new VError(error as Error, `Update vehicle failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async addDealer(dealer: DealerWithoutDates): Promise<void> {
    try {
      const collection = await this.mongoDbClient.getDealerCollection();
      const creationDate = new Date().toISOString();
      await collection.insertOne({ dateOfCreation: creationDate, dateOfLastUpdate: creationDate, ...dealer });
    } catch (error) {
      throw new VError(error as Error, `Add dealer failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async removeDealer(dealerId: string): Promise<void> {
    try {
      const collection = await this.mongoDbClient.getDealerCollection();
      await collection.deleteOne({ _id: new ObjectId(dealerId) });
    } catch (error) {
      throw new VError(error as Error, `Remove dealer failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async getDealer(dealerId: string) {
    try {
      const collection = await this.mongoDbClient.getDealerCollection();
      const dealer = await collection.findOne({ _id: new ObjectId(dealerId) });
      if (!dealer || dealer === null) {
        throw new Error('Dealer not found');
      }
      return dealer;
    } catch (error) {
      throw new VError(error as Error, `Get dealer failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async getDealerVehicles(dealerId: string) {
    try {
      const collection = await this.mongoDbClient.getDealerCollection();
      const dealer = await collection.findOne({ _id: new ObjectId(dealerId) });
      if (!dealer || dealer === null) {
        throw new Error('Dealer not found');
      }
      const vehicleCollection = await this.mongoDbClient.getVehicleCollection();
      const dealerVehicles = await vehicleCollection.find({ dealer: dealerId }).toArray();
      return dealerVehicles;
    } catch (error) {
      throw new VError(error as Error, `Get dealer failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async updateDealer(dealerId: string, updatedDealer: Partial<DealerWithoutDates>): Promise<void> {
    try {
      const collection = await this.mongoDbClient.getDealerCollection();
      const dateOfLastUpdate = new Date().toISOString();
      await collection.updateOne(
        { _id: new ObjectId(dealerId) },
        { $set: { ...updatedDealer, dateOfLastUpdate: dateOfLastUpdate } },
        { upsert: false }
      );
    } catch (error) {
      throw new VError(error as Error, `Update dealer failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }
}
