import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { VehicleService } from '../services/vehicleService';

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<{
  statusCode: number;
  body: string;
}> => {
  const vehicleService = new VehicleService();
  if (!event.pathParameters || !event.pathParameters.dealerId) {
    throw new Error(`Event pathParameters with dealerId should not be empty`);
  }
  const dealerId = event.pathParameters.dealerId;
  await vehicleService.removeDealer(dealerId);

  const output = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Successfully removed the dealer',
        dealer: dealerId,
      },
      null,
      2
    ),
  };
  return output;
};
