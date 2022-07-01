import { handler } from '../../src/handlers/addVehicleHandler';
import { mockEvent, mockContext, mockCallback } from './mocks/eventMocks';

const mockAddVehicle = jest.fn();

jest.mock('../../src/services/vehicleService.ts', () => ({
  VehicleService: function () {
    return {
      addVehicle: mockAddVehicle,
    };
  },
}));

const validEventBody = {
  make: 'Opel',
  model: 'Corsa',
  transmission: 'Automatic',
  fuel_type: 'Petrol',
  mileage: 0,
  vehicle_type: 'Other',
  vehicle_color: 'White',
  dealer: '62bc0e2acf633cf3fdc69eb8',
};

describe('addVehicleHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return succesfull when the event is valid', async () => {
    mockAddVehicle.mockResolvedValue({});

    const addVehicleEvent = { ...mockEvent, body: JSON.stringify(validEventBody) };

    expect(await handler(addVehicleEvent, mockContext, mockCallback)).toEqual({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Successfully added the vehicle',
          vehicle: 'Opel Corsa',
        },
        null,
        2
      ),
    });
  });

  it('should throw error when the event body is empty', async () => {
    await expect(() => handler(mockEvent, mockContext, mockCallback)).rejects.toThrowError(`Event body should not be empty`);
  });

  it('should throw error when schema validation fails', async () => {
    const body = { ...validEventBody, additionalArgument: 'not-excepted' };

    const addVehicleEvent = { ...mockEvent, body: JSON.stringify(body) };

    await expect(() => handler(addVehicleEvent, mockContext, mockCallback)).rejects.toThrowError(
      `Schema validation falied for event body: {\"make\":\"Opel\",\"model\":\"Corsa\",\"transmission\":\"Automatic\",\"fuel_type\":\"Petrol\",\"mileage\":0,\"vehicle_type\":\"Other\",\"vehicle_color\":\"White\",\"dealer\":\"62bc0e2acf633cf3fdc69eb8\",\"additionalArgument\":\"not-excepted\"}`
    );
  });
});
