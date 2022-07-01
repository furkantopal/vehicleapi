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
      await this.mongoDbClient.insertIntoCollection('vehicle', vehicle);
    } catch (error) {
      throw new VError(error as Error, `Add vehicle failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }
  async removeVehicle(vehicleId: string): Promise<void> {
    try {
      await this.mongoDbClient.deleteFromCollection('vehicle', vehicleId);
    } catch (error) {
      throw new VError(error as Error, `Remove vehicle failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async getVehicle(vehicleId: string) {
    try {
      const vehicle = await this.mongoDbClient.findInCollectionWithId('vehicle', vehicleId);
      if (!vehicle || vehicle === null) {
        throw new Error('Vehicle not found');
      }
      const dealer = await this.mongoDbClient.findInCollectionWithId('dealer', vehicle.dealer);
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
      const vehicles = await this.mongoDbClient.getCollectionArray('vehicle');

      if (!vehicles || vehicles === null) {
        throw new Error('Vehicle not found');
      }

      for (const vehicle of vehicles) {
        const dealer = await this.mongoDbClient.findInCollectionWithId('dealer', vehicle.dealer);
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
      await this.mongoDbClient.updateCollection('vehicle', vehicleId, updatedVehicle);
    } catch (error) {
      throw new VError(error as Error, `Update vehicle failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async addDealer(dealer: DealerWithoutDates): Promise<void> {
    try {
      await this.mongoDbClient.insertIntoCollection('dealer', dealer);
    } catch (error) {
      throw new VError(error as Error, `Add dealer failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async removeDealer(dealerId: string): Promise<void> {
    try {
      await this.mongoDbClient.deleteFromCollection('dealer', dealerId);
    } catch (error) {
      throw new VError(error as Error, `Remove dealer failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async getDealer(dealerId: string) {
    try {
      const dealer = await this.mongoDbClient.findInCollectionWithId('dealer', dealerId);
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
      const dealer = await this.mongoDbClient.findInCollectionWithId('dealer', dealerId);
      if (!dealer || dealer === null) {
        throw new Error('Dealer not found');
      }
      const dealerVehicles = await this.mongoDbClient.findInCollectionWithOtherIndex('vehicle', { dealer: dealerId });
      return dealerVehicles;
    } catch (error) {
      throw new VError(error as Error, `Get dealer failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }

  async updateDealer(dealerId: string, updatedDealer: Partial<DealerWithoutDates>): Promise<void> {
    try {
      await this.mongoDbClient.updateCollection('dealer', dealerId, updatedDealer);
    } catch (error) {
      throw new VError(error as Error, `Update dealer failed`);
    } finally {
      await this.mongoDbClient.close();
    }
  }
}
