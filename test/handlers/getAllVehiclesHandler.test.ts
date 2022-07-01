import { handler } from '../../src/handlers/getAllVehiclesHandler';
import { mockEvent, mockContext, mockCallback } from './mocks/eventMocks';

const mockGetAllVehicles = jest.fn();

jest.mock('../../src/services/vehicleService.ts', () => ({
  VehicleService: function () {
    return {
      getAllVehicles: mockGetAllVehicles,
    };
  },
}));

const vehicles = [
  {
    make: 'Opel',
    model: 'Corsa',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    mileage: 0,
    vehicle_type: 'Other',
    vehicle_color: 'White',
    dealer: '62bc0e2acf633cf3fdc69eb8',
  },
  {
    make: 'Tesla',
    model: '3',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    mileage: 0,
    vehicle_type: 'Other',
    vehicle_color: 'White',
    dealer: '62bc0e2acf633cf3fdc69eb8',
  },
];

describe('getAllVehiclesHandler', () => {
  it('should return all the vehicles', async () => {
    mockGetAllVehicles.mockResolvedValue(vehicles);

    expect(await handler(mockEvent, mockContext, mockCallback)).toEqual({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Successfully fethced the all vehicles',
          allVehicles: vehicles,
        },
        null,
        2
      ),
    });
  });
});
