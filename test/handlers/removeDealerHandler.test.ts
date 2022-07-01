import { handler } from '../../src/handlers/removeDealerHandler';
import { mockEvent, mockContext, mockCallback } from './mocks/eventMocks';

const mockRemoveDealer = jest.fn();

jest.mock('../../src/services/vehicleService.ts', () => ({
  VehicleService: function () {
    return {
      removeDealer: mockRemoveDealer,
    };
  },
}));

describe('removeDealerHandler', () => {
  it('should return the successfull when a dealerID is given', async () => {
    mockRemoveDealer.mockResolvedValue({});

    const pathParameters = {
      dealerId: '62bc0bbf51a8677a61eb167f',
    };

    const addDealerEvent = { ...mockEvent, pathParameters: pathParameters };

    expect(await handler(addDealerEvent, mockContext, mockCallback)).toEqual({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Successfully removed the dealer',
          dealer: pathParameters.dealerId,
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
