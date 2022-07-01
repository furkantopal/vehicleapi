export type Vehicle = {
  dateOfCreation: string;
  dateOfLastUpdate: string;
} & VehicleWithoutDates;

export type VehicleWithoutDates = {
  make: string;
  model: string;
  transmission: Transmission;
  fuel_type: Fuel;
  mileage: number;
  vehicle_type: VehicleType;
  vehicle_color: string;
  dealer: string;
};

export type Dealer = {
  dateOfCreation: string;
  dateOfLastUpdate: string;
} & DealerWithoutDates;

export type DealerWithoutDates = {
  dealerName: string;
};

export type Transmission = 'Manual' | 'Semi-automatic' | 'Automatic';
export type Fuel = 'Petrol' | 'Diesel' | 'Eletric' | 'LPG' | 'Hybrid';
export type VehicleType = 'Cabriolet' | 'Coupe' | 'Estate car' | 'SUV' | 'Saloon' | 'Van' | 'Small car' | 'Other';
