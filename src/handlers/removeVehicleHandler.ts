import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { VehicleService } from '../services/vehicleService';

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<{
  statusCode: number;
  body: string;
}> => {
  const vehicleService = new VehicleService();
  if (!event.pathParameters || !event.pathParameters.vehicleId) {
    throw new Error(`Event pathParameters with vehicleId should not be empty`);
  }
  const vehicleId = event.pathParameters.vehicleId;
  await vehicleService.removeVehicle(vehicleId);

  const output = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Successfully removed the vehicle',
        vehicle: vehicleId,
      },
      null,
      2
    ),
  };
  return output;
};
