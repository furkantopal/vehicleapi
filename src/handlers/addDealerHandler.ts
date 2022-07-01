import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { VehicleService } from '../services/vehicleService';
import { DealerWithoutDates } from '../types/vehicle';
import { dealerSchemaValidator } from '../utils/schemaValidator';

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
  const dealer = JSON.parse(event.body) as DealerWithoutDates;
  const validate = dealerSchemaValidator();

  if (!validate(dealer)) {
    throw new Error(`Schema validation falied for event body: ${JSON.stringify(dealer)}`);
  }
  await vehicleService.addDealer(dealer);

  const output = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Successfully added the dealer',
        dealer: dealer.dealerName,
      },
      null,
      2
    ),
  };
  return output;
};
