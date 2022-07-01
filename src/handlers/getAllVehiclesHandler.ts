import { APIGatewayProxyHandler } from 'aws-lambda';
import { VehicleService } from '../services/vehicleService';

export const handler: APIGatewayProxyHandler = async (): Promise<{
  statusCode: number;
  body: string;
}> => {
  const vehicleService = new VehicleService();
  const vehicles = await vehicleService.getAllVehicles();
  const output = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Successfully fethced the all vehicles',
        allVehicles: vehicles,
      },
      null,
      2
    ),
  };
  return output;
};
