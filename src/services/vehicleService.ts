import { VehicleRepository } from '../repositories/vehicleRepository';
import { Dealer, DealerWithoutDates, Vehicle, VehicleWithoutDates } from '../types/vehicle';

export class VehicleService {
  vehicleRepository: VehicleRepository;
  constructor() {
    this.vehicleRepository = new VehicleRepository();
  }

  async addVehicle(vehicle: VehicleWithoutDates): Promise<void> {
    await this.vehicleRepository.addVehicle(vehicle);
  }

  async removeVehicle(vehicleId: string): Promise<void> {
    await this.vehicleRepository.removeVehicle(vehicleId);
  }

  async getVehicle(vehicle: string) {
    return await this.vehicleRepository.getVehicle(vehicle);
  }

  async getAllVehicles() {
    return await this.vehicleRepository.getAllVehicles();
  }

  async updateVehicle(vehicleId: string, updateVehicle: Partial<VehicleWithoutDates>): Promise<void> {
    await this.vehicleRepository.updateVehicle(vehicleId, updateVehicle);
  }

  async addDealer(dealer: DealerWithoutDates): Promise<void> {
    await this.vehicleRepository.addDealer(dealer);
  }

  async removeDealer(dealerId: string): Promise<void> {
    await this.vehicleRepository.removeDealer(dealerId);
  }

  async getDealer(dealerId: string) {
    return await this.vehicleRepository.getDealer(dealerId);
  }

  async getDealerVehicles(dealerId: string) {
    return await this.vehicleRepository.getDealerVehicles(dealerId);
  }

  async updateDealer(dealerId: string, updatedDealer: Partial<DealerWithoutDates>): Promise<void> {
    await this.vehicleRepository.updateDealer(dealerId, updatedDealer);
  }
}
