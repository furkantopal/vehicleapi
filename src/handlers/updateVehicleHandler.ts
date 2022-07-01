import { APIGatewayProxyEvent, APIGatewayProxyHandler, Handler } from 'aws-lambda';
import { VehicleService } from '../services/vehicleService';
import { VehicleWithoutDates } from '../types/vehicle';

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
  const updatedVehicle = JSON.parse(event.body) as Partial<VehicleWithoutDates>;
  if (!event.pathParameters || !event.pathParameters.vehicleId) {
    throw new Error(`Event pathParameters with vehicleId should not be empty`);
  }
  const vehicleId = event.pathParameters.vehicleId;
  await vehicleService.updateVehicle(vehicleId, updatedVehicle);

  const output = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Successfully updated the vehicle',
        vehicle: vehicleId,
      },
      null,
      2
    ),
  };
  return output;
};
