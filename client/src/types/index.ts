// types/index.ts
export interface Flight {
  _id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  gate: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed';
  capacity: number;
  availableSeats: number;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  passengerName: string;
  email: string;
  flight: Flight;
  seatNumber: string;
  qrData: string;
  checkedIn: boolean;
  baggageStatus: string;
}