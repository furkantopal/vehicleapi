import { handler } from '../../src/handlers/getDealerHandler';
import { mockEvent, mockContext, mockCallback } from './mocks/eventMocks';

const mockGetDealer = jest.fn();

jest.mock('../../src/services/vehicleService.ts', () => ({
  VehicleService: function () {
    return {
      getDealer: mockGetDealer,
    };
  },
}));

const dealer = {
  _id: '62bc0bbf51a8677a61eb167f',
  dateOfCreation: '2022-06-29T08:22:23.059Z',
  dateOfLastUpdate: '2022-06-29T08:39:53.912Z',
  dealerName: 'first_postman_dealer',
  name: 'first_postman_dealer_updated',
};

describe('getDealerHandler', () => {
  it('should return the successfull when a dealerID is given', async () => {
    mockGetDealer.mockResolvedValue(dealer);

    const pathParameters = {
      dealerId: '62bc0bbf51a8677a61eb167f',
    };

    const addDealerEvent = { ...mockEvent, pathParameters: pathParameters };

    expect(await handler(addDealerEvent, mockContext, mockCallback)).toEqual({
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Successfully fetched the dealer',
          dealer: dealer,
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
