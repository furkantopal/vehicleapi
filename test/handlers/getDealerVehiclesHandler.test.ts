import { handler } from '../../src/handlers/getDealerVehiclesHandler';
import { mockEvent, mockContext, mockCallback } from './mocks/eventMocks';

const mockGetDealerVehicles = jest.fn();

jest.mock('../../src/services/vehicleService.ts', () => ({
  VehicleService: function () {
    return {
      getDealerVehicles: mockGetDealerVehicles,
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

describe('getDealerVehiclesHandler', () => {
  it('should return all the vehicles of the dealer', async () => {
    mockGetDealerVehicles.mockResolvedValue(vehicles);

    const pathParameters = {
      dealerId: '62bc0bbf51a8677a61eb167f',
    };

    const addDealerEvent = { ...mockEvent, pathParameters: pathParameters };

    expect(await handler(addDealerEvent, mockContext, mockCallback)).toEqual({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `Successfully fetched the dealer's all vehicles`,
          allVehiclesofDealer: vehicles,
        },
        null,
        2
      ),
    });
  });

  it('should throw error when the pathParameters with dealerId is empty', async () => {
    await expect(() => handler(mockEvent, mockContext, mockCallback)).rejects.toThrowError(
      'Event pathParameters with dealerId should not be empty'
    );
  });
});
