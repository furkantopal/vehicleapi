import { handler } from '../../src/handlers/addDealerHandler';
import { mockEvent, mockContext, mockCallback } from './mocks/eventMocks';

const mockAddDealer = jest.fn();

jest.mock('../../src/services/vehicleService.ts', () => ({
  VehicleService: function () {
    return {
      addDealer: mockAddDealer,
    };
  },
}));

describe('addDealerHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return succesfull when the event is valid', async () => {
    mockAddDealer.mockResolvedValue({});

    const body = {
      dealerName: 'test-dealer',
    };

    const addDealerEvent = { ...mockEvent, body: JSON.stringify(body) };

    expect(await handler(addDealerEvent, mockContext, mockCallback)).toEqual({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Successfully added the dealer',
          dealer: 'test-dealer',
        },
        null,
        2
      ),
    });
  });

  it('should throw error when the event body is empty', async () => {
    await expect(() => handler(mockEvent, mockContext, mockCallback)).rejects.toThrowError('Event body should not be empty');
  });

  it('should throw error when schema validation fails', async () => {
    const body = {
      dealerName: 'test-dealer',
      additionalArgument: 'not-excepted',
    };

    const addDealerEvent = { ...mockEvent, body: JSON.stringify(body) };

    await expect(() => handler(addDealerEvent, mockContext, mockCallback)).rejects.toThrowError(
      `Schema validation falied for event body: {\"dealerName\":\"test-dealer\",\"additionalArgument\":\"not-excepted\"}`
    );
  });
});
