import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { VehicleService } from '../services/vehicleService';
import { VehicleWithoutDates } from '../types/vehicle';
import { vehicleSchemaValidator } from '../utils/schemaValidator';

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
  const vehicle = JSON.parse(event.body) as VehicleWithoutDates;
  const validate = vehicleSchemaValidator();

  if (!validate(vehicle)) {
    throw new Error(`Schema validation falied for event body: ${JSON.stringify(vehicle)}`);
  }

  await vehicleService.addVehicle(vehicle);

  const output = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Successfully added the vehicle',
        vehicle: vehicle.make + ' ' + vehicle.model,
      },
      null,
      2
    ),
  };
  return output;
};
