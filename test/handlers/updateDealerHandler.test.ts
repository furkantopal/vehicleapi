import { handler } from '../../src/handlers/updateDealerHandler';
import { mockEvent, mockContext, mockCallback } from './mocks/eventMocks';

const mockUpdateDealer = jest.fn();

jest.mock('../../src/services/vehicleService.ts', () => ({
  VehicleService: function () {
    return {
      updateDealer: mockUpdateDealer,
    };
  },
}));

const pathParameters = {
  dealerId: '62bc0bbf51a8677a61eb167f',
};

const body = {
  dealerName: 'test-dealer',
};

describe('updateDealerHandler', () => {
  it('should return the successfull when a dealerID and a event body is given', async () => {
    mockUpdateDealer.mockResolvedValue({});

    const addDealerEvent = { ...mockEvent, pathParameters: pathParameters, body: JSON.stringify(body) };

    expect(await handler(addDealerEvent, mockContext, mockCallback)).toEqual({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Successfully updated the dealer',
          dealer: pathParameters.dealerId,
        },
        null,
        2
      ),
    });
  });

  it('should throw error when the event body is empty', async () => {
    await expect(() => handler(mockEvent, mockContext, mockCallback)).rejects.toThrowError('Event body should not be empty');
  });
  it('should throw error when the pathParameters with dealerId is empty', async () => {
    const addDealerEvent = { ...mockEvent, body: JSON.stringify(body) };

    await expect(() => handler(addDealerEvent, mockContext, mockCallback)).rejects.toThrowError(
      'Event pathParameters with dealerId should not be empty'
    );
  });
});
