import { handler } from '../../src/handlers/updateVehicleHandler';
import { mockEvent, mockContext, mockCallback } from './mocks/eventMocks';

const mockUpdateVehicle = jest.fn();

jest.mock('../../src/services/vehicleService.ts', () => ({
  VehicleService: function () {
    return {
      updateVehicle: mockUpdateVehicle,
    };
  },
}));

const pathParameters = {
  vehicleId: '62bc0bbf51a8677a61eb167f',
};

const body = {
  vehicleName: 'test-vehicle',
};

describe('updateVehicleHandler', () => {
  it('should return the successfull when a vehicleID and a event body is given', async () => {
    mockUpdateVehicle.mockResolvedValue({});

    const addVehicleEvent = { ...mockEvent, pathParameters: pathParameters, body: JSON.stringify(body) };

    expect(await handler(addVehicleEvent, mockContext, mockCallback)).toEqual({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Successfully updated the vehicle',
          vehicle: pathParameters.vehicleId,
        },
        null,
        2
      ),
    });
  });

  it('should throw error when the event body is empty', async () => {
    await expect(() => handler(mockEvent, mockContext, mockCallback)).rejects.toThrowError('Event body should not be empty');
  });
  it('should throw error when the pathParameters with vehicleId is empty', async () => {
    const addVehicleEvent = { ...mockEvent, body: JSON.stringify(body) };

    await expect(() => handler(addVehicleEvent, mockContext, mockCallback)).rejects.toThrowError(
      'Event pathParameters with vehicleId should not be empty'
    );
  });
});
