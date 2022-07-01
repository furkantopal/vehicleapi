import { APIGatewayProxyEvent, APIGatewayProxyHandler, Handler } from 'aws-lambda';
import { VehicleService } from '../services/vehicleService';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<{
  statusCode: number;
  body: string;
}> => {
  const vehicleService = new VehicleService();
  if (!event.pathParameters || !event.pathParameters.dealerId) {
    throw new Error(`Event pathParameters with dealerId should not be empty`);
  }
  const dealer = await vehicleService.getDealer(event.pathParameters.dealerId);

  const output = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Successfully fetched the dealer',
        dealer: dealer,
      },
      null,
      2
    ),
  };
  return output;
};
