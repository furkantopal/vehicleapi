import { handler } from '../../src/handlers/removeVehicleHandler';
import { mockEvent, mockContext, mockCallback } from './mocks/eventMocks';

const mockRemoveVehicle = jest.fn();

jest.mock('../../src/services/vehicleService.ts', () => ({
  VehicleService: function () {
    return {
      removeVehicle: mockRemoveVehicle,
    };
  },
}));

describe('removeVehicleHandler', () => {
  it('should return the successfull when a vehicleID is given', async () => {
    mockRemoveVehicle.mockResolvedValue({});

    const pathParameters = {
      vehicleId: '62bc0bbf51a8677a61eb167f',
    };

    const addVehicleEvent = { ...mockEvent, pathParameters: pathParameters };

    expect(await handler(addVehicleEvent, mockContext, mockCallback)).toEqual({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Successfully removed the vehicle',
          vehicle: pathParameters.vehicleId,
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
