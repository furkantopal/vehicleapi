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

const mockInsertOne = jest.fn();
const mockDeleteOne = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockFindToArray = jest.fn();
const mockUpdateOne = jest.fn();
const mockClose = jest.fn();

const mockGetVehicleCollection = jest.fn();
const mockGetDealerCollection = jest.fn();

jest.mock('../../src/client/mongoDbClient.ts', () => ({
  MongoDbClient: function () {
    return {
      getVehicleCollection: mockGetVehicleCollection,
      getDealerCollection: mockGetDealerCollection,
      close: mockClose,
    };
  },
}));

mockGetVehicleCollection.mockResolvedValue({
  insertOne: mockInsertOne,
  deleteOne: mockDeleteOne,
  findOne: mockFindOne,
  find: mockFind,
  updateOne: mockUpdateOne,
});
mockGetDealerCollection.mockResolvedValue({
  insertOne: mockInsertOne,
  deleteOne: mockDeleteOne,
  findOne: mockFindOne,
  find: mockFind,
  updateOne: mockUpdateOne,
});

describe('Vehicle Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInsertOne.mockResolvedValue({});
    mockFindOne.mockResolvedValue({});
    mockFind.mockResolvedValue({
      toArray: mockFindToArray,
    });
    mockFindToArray.mockResolvedValue({});
    mockDeleteOne.mockResolvedValue({});
    mockUpdateOne.mockResolvedValue({});
    mockClose.mockResolvedValue({});
  });

  jest.useFakeTimers().setSystemTime(new Date('2022-01-01T11:11:11.114Z').getTime());

  const vehicleRepository = new VehicleRepository();

  it('should add vehicle', async () => {
    await vehicleRepository.addVehicle(vehicle);
    expect(mockInsertOne).toHaveBeenCalledTimes(1);
    expect(mockInsertOne).toHaveBeenCalledWith(vehicleDbRecordWithoutId);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when insert to the db failed for vehicle', async () => {
    mockInsertOne.mockRejectedValue({});
    await expect(() => vehicleRepository.addVehicle(vehicle)).rejects.toThrowError(`Add vehicle failed`);
  });

  it('should remove vehicle', async () => {
    await vehicleRepository.removeVehicle(String(vehicleDbRecord._id));
    expect(mockDeleteOne).toHaveBeenCalledTimes(1);
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: new ObjectId(vehicleDbRecord._id) });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when delete from the db failed for vehicle', async () => {
    mockDeleteOne.mockRejectedValue({});
    await expect(() => vehicleRepository.removeVehicle(String(vehicleDbRecord._id))).rejects.toThrowError(`Remove vehicle failed`);
  });

  it('should get vehicle', async () => {
    mockFindOne.mockResolvedValueOnce(vehicle);
    mockFindOne.mockResolvedValueOnce(dealer);
    expect(await vehicleRepository.getVehicle(String(vehicleDbRecord._id))).toEqual({ ...vehicle, dealer: dealer });
    expect(mockFindOne).toHaveBeenCalledTimes(2);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: new ObjectId(vehicleDbRecord._id) });
    expect(mockFindOne).toHaveBeenCalledWith({ _id: new ObjectId(vehicleDbRecord.dealer) });
  });

  it('should throw error when find fails in db for getVehicle', async () => {
    mockFindOne.mockRejectedValue({});
    await expect(() => vehicleRepository.getVehicle(String(vehicleDbRecord._id))).rejects.toThrowError(`Get vehicle failed`);
  });

  it.skip('should get all vehicle', async () => {
    mockFindToArray.mockResolvedValue([vehicle]);
    mockFindOne.mockResolvedValue(dealer);
    expect(await vehicleRepository.getAllVehicles()).toEqual({ ...vehicle, dealer: dealer });
    expect(mockFindOne).toHaveBeenCalledTimes(2);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: new ObjectId(vehicleDbRecord.dealer) });
  });

  it('should throw error when find fails in db for getVehicle', async () => {
    mockFindOne.mockRejectedValue({});
    await expect(() => vehicleRepository.getAllVehicles()).rejects.toThrowError(`Get vehicle failed`);
  });

  it('should update vehicle', async () => {
    await vehicleRepository.updateVehicle(String(vehicleDbRecord._id), { vehicle_color: 'Purple' });
    expect(mockUpdateOne).toHaveBeenCalledTimes(1);
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(vehicleDbRecord._id) },
      { $set: { ...{ vehicle_color: 'Purple' }, dateOfLastUpdate: new Date().toISOString() } },
      { upsert: false }
    );
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when update fails in db for vehicle', async () => {
    mockUpdateOne.mockRejectedValue({});
    await expect(() => vehicleRepository.updateVehicle(String(vehicleDbRecord._id), { vehicle_color: 'Purple' })).rejects.toThrowError(
      `Update vehicle failed`
    );
  });

  it('should add dealer', async () => {
    await vehicleRepository.addDealer(dealer);
    expect(mockInsertOne).toHaveBeenCalledTimes(1);
    expect(mockInsertOne).toHaveBeenCalledWith(dealerDbRecordWithoutId);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when insert to the db failed for dealer', async () => {
    mockInsertOne.mockRejectedValue({});
    await expect(() => vehicleRepository.addDealer(dealer)).rejects.toThrowError(`Add dealer failed`);
  });

  it('should remove dealer', async () => {
    await vehicleRepository.removeDealer(String(dealerDbRecord._id));
    expect(mockDeleteOne).toHaveBeenCalledTimes(1);
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: new ObjectId(dealerDbRecord._id) });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when delete from the db failed for dealer', async () => {
    mockDeleteOne.mockRejectedValue({});
    await expect(() => vehicleRepository.removeDealer(String(dealerDbRecord._id))).rejects.toThrowError(`Remove dealer failed`);
  });

  it('should get dealer', async () => {
    mockFindOne.mockResolvedValueOnce(dealer);
    expect(await vehicleRepository.getDealer(String(dealerDbRecord._id))).toEqual(dealer);
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: new ObjectId(vehicleDbRecord.dealer) });
  });

  it('should throw error when find fails in db for getDealer', async () => {
    mockFindOne.mockRejectedValue({});
    await expect(() => vehicleRepository.getDealer(String(dealerDbRecord._id))).rejects.toThrowError(`Get dealer failed`);
  });
  it('should throw error when no dealer returns from the db', async () => {
    mockFindOne.mockResolvedValue(undefined);
    await expect(() => vehicleRepository.getDealer(String(dealerDbRecord._id))).rejects.toThrowError('Dealer not found');
  });

  it.skip(`should dealer's all vehicles`, async () => {
    mockFindOne.mockResolvedValue(dealer);
    mockFindToArray.mockResolvedValue([vehicle]);
    expect(await vehicleRepository.getDealerVehicles(String(dealerDbRecord._id))).toEqual(vehicle);
    expect(mockFindOne).toHaveBeenCalledTimes(2);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: new ObjectId(vehicleDbRecord.dealer) });
  });

  it('should throw error when find fails in db for getDealer', async () => {
    mockFindOne.mockRejectedValue({});
    await expect(() => vehicleRepository.getDealerVehicles(String(dealerDbRecord._id))).rejects.toThrowError(`Get dealer failed`);
  });

  it('should update dealer', async () => {
    await vehicleRepository.updateDealer(String(dealerDbRecord._id), { dealerName: 'first_postman_dealer_updated' });
    expect(mockUpdateOne).toHaveBeenCalledTimes(1);
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(dealerDbRecord._id) },
      { $set: { ...{ dealerName: 'first_postman_dealer_updated' }, dateOfLastUpdate: new Date().toISOString() } },
      { upsert: false }
    );
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw error when update fails in db for dealer', async () => {
    mockUpdateOne.mockRejectedValue({});
    await expect(() =>
      vehicleRepository.updateDealer(String(dealerDbRecord._id), { dealerName: 'first_postman_dealer_updated' })
    ).rejects.toThrowError(`Update dealer failed`);
  });
});
