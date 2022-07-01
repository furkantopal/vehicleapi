import { APIGatewayProxyEvent, APIGatewayProxyHandler, Handler } from 'aws-lambda';
import { VehicleService } from '../services/vehicleService';
import { DealerWithoutDates } from '../types/vehicle';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<{
  statusCode: number;
  body: string;
}> => {
  const vehicleService = new VehicleService();
  if (!event.body || event.body === null) {
    throw new Error(`Event body should not be empty`);
  }
  const updatedDealer = JSON.parse(event.body) as Partial<DealerWithoutDates>;
  if (!event.pathParameters || !event.pathParameters.dealerId) {
    throw new Error(`Event pathParameters with dealerId should not be empty`);
  }
  const dealerId = event.pathParameters.dealerId;
  await vehicleService.updateDealer(dealerId, updatedDealer);

  const output = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Successfully updated the dealer',
        dealer: dealerId,
      },
      null,
      2
    ),
  };
  return output;
};
