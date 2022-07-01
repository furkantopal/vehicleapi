export const vehicleWithoutDatesSchema = {
  type: 'object',
  properties: {
    make: { type: 'string' },
    model: { type: 'string' },
    transmission: { type: 'string' },
    fuel_type: { type: 'string' },
    mileage: { type: 'integer' },
    vehicle_type: { type: 'string' },
    vehicle_color: { type: 'string' },
    dealer: { type: 'string' },
  },
  required: ['make', 'model', 'transmission', 'fuel_type', 'mileage', 'vehicle_type', 'vehicle_color', 'dealer'],
  additionalProperties: false,
};

export const dealerWithoutDatesSchema = {
  type: 'object',
  properties: {
    dealerName: { type: 'string' },
  },
  required: ['dealerName'],
  additionalProperties: false,
};
