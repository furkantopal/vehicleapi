import { handler } from '../../src/handlers/getVehicleHandler';
import { mockEvent, mockContext, mockCallback } from './mocks/eventMocks';

const mockGetVehicle = jest.fn();

jest.mock('../../src/services/vehicleService.ts', () => ({
  VehicleService: function () {
    return {
      getVehicle: mockGetVehicle,
    };
  },
}));

const vehicle = {
  _id: '62bc0d953cd1023dc847e319',
  dateOfCreation: '2022-06-29T08:30:13.007Z',
  dateOfLastUpdate: '2022-06-29T08:30:13.007Z',
  make: 'Tesla',
  model: '3',
  transmission: 'Automatic',
  fuel_type: 'Petrol',
  mileage: 0,
  vehicle_type: 'Other',
  vehicle_color: 'White',
  dealer: {
    _id: '62bc0bbf51a8677a61eb167f',
    dateOfCreation: '2022-06-29T08:22:23.059Z',
    dateOfLastUpdate: '2022-06-29T08:39:53.912Z',
    dealerName: 'first_postman_dealer',
    name: 'first_postman_dealer_updated',
  },
};

describe('getVehicleHandler', () => {
  it('should return the successfull when a vehicleID is given', async () => {
    mockGetVehicle.mockResolvedValue(vehicle);

    const pathParameters = {
      vehicleId: '62bc0bbf51a8677a61eb167f',
    };

    const addVehicleEvent = { ...mockEvent, pathParameters: pathParameters };

    expect(await handler(addVehicleEvent, mockContext, mockCallback)).toEqual({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Successfully fetched the vehicle',
          vehicle: vehicle,
        },
        null,
        2
      ),
    });
  });

  it('should throw error when the pathParameters with vehicleId is empty', async () => {
    await expect(() => handler(mockEvent, mockContext, mockCallback)).rejects.toThrowError(
      'Event pathParameters with vehicleId should not be empty'
    );
  });
});
