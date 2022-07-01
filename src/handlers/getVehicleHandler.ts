import { APIGatewayProxyHandler } from 'aws-lambda';
import { VehicleService } from '../services/vehicleService';

export const handler: APIGatewayProxyHandler = async (
  event: any
): Promise<{
  statusCode: number;
  body: string;
}> => {
  const vehicleService = new VehicleService();
  if (!event.pathParameters || !event.pathParameters.vehicleId) {
    throw new Error(`Event pathParameters with vehicleId should not be empty`);
  }
  const vehicle = await vehicleService.getVehicle(event.pathParameters.vehicleId);

  const output = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Successfully fetched the vehicle',
        vehicle: vehicle,
      },
      null,
      2
    ),
  };
  return output;
};
