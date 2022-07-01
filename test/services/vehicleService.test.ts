import { VehicleService } from '../../src/services/vehicleService';
import { Transmission, Fuel, VehicleType, VehicleWithoutDates, DealerWithoutDates } from '../../src/types/vehicle';

const mockAddVehicle = jest.fn();
const mockRemoveVehicle = jest.fn();
const mockGetVehicle = jest.fn();
const mockGetAllVehicles = jest.fn();
const mockUpdateVehicle = jest.fn();
const mockAddDealer = jest.fn();
const mockRemoveDealer = jest.fn();
const mockGetDealer = jest.fn();
const mockGetDealerVehicles = jest.fn();
const mockUpdateDealer = jest.fn();

jest.mock('../../src/repositories/vehicleRepository.ts', () => ({
  VehicleRepository: function () {
    return {
      addVehicle: mockAddVehicle,
      removeVehicle: mockRemoveVehicle,
      getVehicle: mockGetVehicle,
      getAllVehicles: mockGetAllVehicles,
      updateVehicle: mockUpdateVehicle,
      addDealer: mockAddDealer,
      removeDealer: mockRemoveDealer,
      getDealer: mockGetDealer,
      getDealerVehicles: mockGetDealerVehicles,
      updateDealer: mockUpdateDealer,
    };
  },
}));

const vehicle = {
  make: 'Tesla',
  model: '3',
  transmission: 'Automatic' as Transmission,
  fuel_type: 'Petrol' as Fuel,
  mileage: 0,
  vehicle_type: 'Other' as VehicleType,
  vehicle_color: 'White',
  dealer: '62bb27ba91e4b7fb0937893f',
} as VehicleWithoutDates;

const dealer = {
  dealerName: 'dealer-name',
} as DealerWithoutDates;

describe('Vehicle Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const vehicleService = new VehicleService();

  it('should add vehicle', async () => {
    await vehicleService.addVehicle(vehicle);
    expect(mockAddVehicle).toHaveBeenCalledTimes(1);
    expect(mockAddVehicle).toHaveBeenCalledWith(vehicle);
  });

  it('should remove vehicle', async () => {
    await vehicleService.removeVehicle('vehicle_id');
    expect(mockRemoveVehicle).toHaveBeenCalledTimes(1);
    expect(mockRemoveVehicle).toHaveBeenCalledWith('vehicle_id');
  });

  it('should get vehicle', async () => {
    mockGetVehicle.mockResolvedValue(vehicle);
    expect(await vehicleService.getVehicle('vehicle_id')).toEqual(vehicle);
    expect(mockGetVehicle).toHaveBeenCalledTimes(1);
    expect(mockGetVehicle).toHaveBeenCalledWith('vehicle_id');
  });

  it('should get all vehicles', async () => {
    mockGetAllVehicles.mockResolvedValue([vehicle, vehicle]);
    expect(await vehicleService.getAllVehicles()).toEqual([vehicle, vehicle]);
    expect(mockGetAllVehicles).toHaveBeenCalledTimes(1);
    expect(mockGetAllVehicles).toHaveBeenCalledWith();
  });

  it('should update vehicle', async () => {
    mockUpdateVehicle.mockResolvedValue({ ...vehicle, model: '4' });
    await vehicleService.updateVehicle('vehicle_id', { ...vehicle, model: '4' } as Partial<VehicleWithoutDates>);
    expect(mockUpdateVehicle).toHaveBeenCalledTimes(1);
    expect(mockUpdateVehicle).toHaveBeenCalledWith('vehicle_id', { ...vehicle, model: '4' });
  });

  it('should add dealer', async () => {
    await vehicleService.addDealer(dealer);
    expect(mockAddDealer).toHaveBeenCalledTimes(1);
    expect(mockAddDealer).toHaveBeenCalledWith(dealer);
  });

  it('should remove dealer', async () => {
    await vehicleService.removeDealer('dealer_id');
    expect(mockRemoveDealer).toHaveBeenCalledTimes(1);
    expect(mockRemoveDealer).toHaveBeenCalledWith('dealer_id');
  });

  it('should get dealer', async () => {
    mockGetDealer.mockResolvedValue(dealer);
    expect(await vehicleService.getDealer('dealer_id')).toEqual(dealer);
    expect(mockGetDealer).toHaveBeenCalledTimes(1);
    expect(mockGetDealer).toHaveBeenCalledWith('dealer_id');
  });

  it(`should get dealer's vehicles`, async () => {
    mockGetDealerVehicles.mockResolvedValue([vehicle, vehicle]);
    expect(await vehicleService.getDealerVehicles('dealer_id')).toEqual([vehicle, vehicle]);
    expect(mockGetDealerVehicles).toHaveBeenCalledTimes(1);
    expect(mockGetDealerVehicles).toHaveBeenCalledWith('dealer_id');
  });

  it('should update vehicle', async () => {
    mockUpdateDealer.mockResolvedValue({ ...dealer, dealerName: 'dealer-name' });
    await vehicleService.updateDealer('dealer_id', { ...dealer, dealerName: 'dealer-name' } as Partial<DealerWithoutDates>);
    expect(mockUpdateDealer).toHaveBeenCalledTimes(1);
    expect(mockUpdateDealer).toHaveBeenCalledWith('dealer_id', { ...dealer, dealerName: 'dealer-name' });
  });
});
