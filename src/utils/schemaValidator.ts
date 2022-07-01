import Ajv from 'ajv';

import { vehicleWithoutDatesSchema, dealerWithoutDatesSchema } from './schemas/vehicleSchemas';

export function vehicleSchemaValidator() {
  const ajv = new Ajv();
  return ajv.compile(vehicleWithoutDatesSchema);
}

export function dealerSchemaValidator() {
  const ajv = new Ajv();
  return ajv.compile(dealerWithoutDatesSchema);
}
