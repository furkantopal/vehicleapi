import { ObjectId } from 'mongodb';
import { VehicleRepository } from '../../src/repositories/vehicleRepository';
import { Transmission, Fuel, VehicleType, VehicleWithoutDates, DealerWithoutDates } from '../../src/types/vehicle';

const vehicle = {
  make: 'Opel',
  model: 'Corsa',
  transmission: 'Automatic' as Transmission,
  fuel_type: 'Petrol' as Fuel,
  mileage: 0,
  vehicle_type: 'Other' as VehicleType,
  vehicle_color: 'Purple',
  dealer: '62bcae0ff66babce94b2b07c',
} as VehicleWithoutDates;

const vehicleDbRecordWithoutId = {
  dateOfCreation: '2022-01-01T11:11:11.114Z',
  dateOfLastUpdate: '2022-01-01T11:11:11.114Z',
  ...vehicle,
};

const vehicleDbRecord = {
  _id: new ObjectId('62bcae1f24621cbba9c2333c'),
  ...vehicleDbRecordWithoutId,
};

const dealer = {
  dealerName: 'first_postman_dealer',
} as DealerWithoutDates;

const dealerDbRecordWithoutId = {
  dateOfCreation: '2022-01-01T11:11:11.114Z',
  dateOfLastUpdate: '2022-01-01T11:11:11.114Z',
  ...dealer,
};

const dealerDbRecord = {
  _id: new ObjectId('62bcae0ff66babce94b2b07c'),
  ...dealerDbRecordWithoutId,
};

const mockgetCollection = jest.fn();
const mockGetCollectionArray = jest.fn();
const mockInsertIntoCollection = jest.fn();
const mockDeleteFromCollection = jest.fn();
const mockFindInCollectionWithId = jest.fn();
const mockFindInCollectionWithOtherIndex = jest.fn();
const mockUpdateCollection = jest.fn();
const mockClose = jest.fn();

jest.mock('../../src/client/mongoDbClient.ts', () => ({
  MongoDbClient: function () {
    return {
      getCollection: mockgetCollection,
      getCollectionArray: mockGetCollectionArray,
      insertIntoCollection: mockInsertIntoCollection,
      deleteFromCollection: mockDeleteFromCollection,
      findInCollectionWithId: mockFindInCollectionWithId,
      findInCollectionWithOtherIndex: mockFindInCollectionWithOtherIndex,
      updateCollection: mockUpdateCollection,
      close: mockClose,
    };
  },
}));

describe('Vehicle Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockgetCollection.mockResolvedValue({});
    mockGetCollectionArray.mockResolvedValue({});
    mockInsertIntoCollection.mockResolvedValue({});
    mockDeleteFromCollection.mockResolvedValue({});
    mockFindInCollectionWithId.mockResolvedValue({});
    mockFindInCollectionWithOtherIndex.mockResolvedValue({});
    mockUpdateCollection.mockResolvedValue({});
    mockClose.mockResolvedValue({});
  });

  jest.useFakeTimers().setSystemTime(new Date('2022-01-01T11:11:11.114Z').getTime());

  const vehicleRepository = new VehicleRepository();

  it('should add vehicle', async () => {
    await vehicleRepository.addVehicle(vehicle);
    expect(mockInsertIntoCollection).toHaveBeenCalledTimes(1);
    expect(mockInsertIntoCollection).toHaveBeenCalledWith('vehicle', vehicle);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when insert to the db failed for vehicle', async () => {
    mockInsertIntoCollection.mockRejectedValue({});
    await expect(() => vehicleRepository.addVehicle(vehicle)).rejects.toThrowError(`Add vehicle failed`);
  });

  it('should remove vehicle', async () => {
    const vehicleId = String(vehicleDbRecord._id);
    await vehicleRepository.removeVehicle(vehicleId);
    expect(mockDeleteFromCollection).toHaveBeenCalledTimes(1);
    expect(mockDeleteFromCollection).toHaveBeenCalledWith('vehicle', vehicleId);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when delete from the db failed for vehicle', async () => {
    mockDeleteFromCollection.mockRejectedValue({});
    await expect(() => vehicleRepository.removeVehicle(String(vehicleDbRecord._id))).rejects.toThrowError(`Remove vehicle failed`);
  });

  it('should get vehicle', async () => {
    mockFindInCollectionWithId.mockResolvedValueOnce(vehicle);
    mockFindInCollectionWithId.mockResolvedValueOnce(dealer);
    expect(await vehicleRepository.getVehicle(String(vehicleDbRecord._id))).toEqual({ ...vehicle, dealer: dealer });
    expect(mockFindInCollectionWithId).toHaveBeenCalledTimes(2);
    expect(mockFindInCollectionWithId).toHaveBeenCalledWith('vehicle', String(vehicleDbRecord._id));
    expect(mockFindInCollectionWithId).toHaveBeenCalledWith('dealer', String(vehicleDbRecord.dealer));
  });

  it('should throw error when vehicle found in the db', async () => {
    mockFindInCollectionWithId.mockResolvedValueOnce(null);
    await expect(() => vehicleRepository.getVehicle(String(vehicleDbRecord._id))).rejects.toThrowError('Vehicle not found');
  });

  it('should throw error when find fails in db for getVehicle', async () => {
    mockFindInCollectionWithId.mockRejectedValue({});
    await expect(() => vehicleRepository.getVehicle(String(vehicleDbRecord._id))).rejects.toThrowError(`Get vehicle failed`);
  });

  it('should get all vehicle', async () => {
    mockGetCollectionArray.mockResolvedValue([vehicle]);
    mockFindInCollectionWithId.mockResolvedValue(dealer);
    expect(await vehicleRepository.getAllVehicles()).toEqual([{ ...vehicle, dealer: dealer }]);
    expect(mockFindInCollectionWithId).toHaveBeenCalledTimes(1);
    expect(mockFindInCollectionWithId).toHaveBeenCalledWith('dealer', String(vehicleDbRecord.dealer));
  });

  it('should throw error when find fails in db for getVehicle', async () => {
    mockFindInCollectionWithId.mockRejectedValue({});
    await expect(() => vehicleRepository.getAllVehicles()).rejects.toThrowError(`Get vehicle failed`);
  });

  it('should throw error when vehicle found in the db', async () => {
    mockGetCollectionArray.mockResolvedValueOnce(null);
    await expect(() => vehicleRepository.getAllVehicles()).rejects.toThrowError('Vehicle not found');
  });

  it('should update vehicle', async () => {
    await vehicleRepository.updateVehicle(String(vehicleDbRecord._id), { vehicle_color: 'Purple' });
    expect(mockUpdateCollection).toHaveBeenCalledTimes(1);
    expect(mockUpdateCollection).toHaveBeenCalledWith('vehicle', String(vehicleDbRecord._id), {
      vehicle_color: 'Purple',
    });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when update fails in db for vehicle', async () => {
    mockUpdateCollection.mockRejectedValue({});
    await expect(() => vehicleRepository.updateVehicle(String(vehicleDbRecord._id), { vehicle_color: 'Purple' })).rejects.toThrowError(
      `Update vehicle failed`
    );
  });

  it('should add dealer', async () => {
    await vehicleRepository.addDealer(dealer);
    expect(mockInsertIntoCollection).toHaveBeenCalledTimes(1);
    expect(mockInsertIntoCollection).toHaveBeenCalledWith('dealer', dealer);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when insert to the db failed for dealer', async () => {
    mockInsertIntoCollection.mockRejectedValue({});
    await expect(() => vehicleRepository.addDealer(dealer)).rejects.toThrowError(`Add dealer failed`);
  });

  it('should remove dealer', async () => {
    const dealerId = String(dealerDbRecord._id);
    await vehicleRepository.removeDealer(dealerId);
    expect(mockDeleteFromCollection).toHaveBeenCalledTimes(1);
    expect(mockDeleteFromCollection).toHaveBeenCalledWith('dealer', dealerId);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when delete from the db failed for dealer', async () => {
    mockDeleteFromCollection.mockRejectedValue({});
    await expect(() => vehicleRepository.removeDealer(String(dealerDbRecord._id))).rejects.toThrowError(`Remove dealer failed`);
  });

  it('should get dealer', async () => {
    mockFindInCollectionWithId.mockResolvedValueOnce(dealer);
    expect(await vehicleRepository.getDealer(String(dealerDbRecord._id))).toEqual(dealer);
    expect(mockFindInCollectionWithId).toHaveBeenCalledTimes(1);
    expect(mockFindInCollectionWithId).toHaveBeenCalledWith('dealer', String(vehicleDbRecord.dealer));
  });

  it('should throw error when find fails in db for getDealer', async () => {
    mockFindInCollectionWithId.mockRejectedValue({});
    await expect(() => vehicleRepository.getDealer(String(dealerDbRecord._id))).rejects.toThrowError(`Get dealer failed`);
  });
  it('should throw error when no dealer returns from the db', async () => {
    mockFindInCollectionWithId.mockResolvedValue(undefined);
    await expect(() => vehicleRepository.getDealer(String(dealerDbRecord._id))).rejects.toThrowError('Dealer not found');
  });

  it(`should dealer's all vehicles`, async () => {
    mockFindInCollectionWithId.mockResolvedValue(dealerDbRecord);
    mockFindInCollectionWithOtherIndex.mockResolvedValue([vehicleDbRecord]);
    expect(await vehicleRepository.getDealerVehicles(String(dealerDbRecord._id))).toEqual([vehicleDbRecord]);
    expect(mockFindInCollectionWithId).toHaveBeenCalledTimes(1);
    expect(mockFindInCollectionWithOtherIndex).toHaveBeenCalledTimes(1);
    expect(mockFindInCollectionWithId).toHaveBeenCalledWith('dealer', String(vehicleDbRecord.dealer));
    expect(mockFindInCollectionWithOtherIndex).toHaveBeenCalledWith('vehicle', { dealer: vehicleDbRecord.dealer });
  });

  it('should throw error when find fails in db for getDealer', async () => {
    mockFindInCollectionWithId.mockRejectedValue({});
    await expect(() => vehicleRepository.getDealerVehicles(String(dealerDbRecord._id))).rejects.toThrowError(`Get dealer failed`);
  });

  it('should throw error when find fails in db for getDealer', async () => {
    mockFindInCollectionWithId.mockResolvedValueOnce(null);
    await expect(() => vehicleRepository.getDealerVehicles(String(dealerDbRecord._id))).rejects.toThrowError(`Dealer not found`);
  });

  it('should update dealer', async () => {
    await vehicleRepository.updateDealer(String(dealerDbRecord._id), { dealerName: 'first_postman_dealer_updated' });
    expect(mockUpdateCollection).toHaveBeenCalledTimes(1);
    expect(mockUpdateCollection).toHaveBeenCalledWith('dealer', String(dealerDbRecord._id), { dealerName: 'first_postman_dealer_updated' });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when update fails in db for dealer', async () => {
    mockUpdateCollection.mockRejectedValue({});
    await expect(() =>
      vehicleRepository.updateDealer(String(dealerDbRecord._id), { dealerName: 'first_postman_dealer_updated' })
    ).rejects.toThrowError(`Update dealer failed`);
  });
});
