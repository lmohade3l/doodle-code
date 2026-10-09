export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export type ShipmentEvent = {
  at: string;
  title: string;
  location: string;
};

export type Shipment = {
  id: string;
  trackingCode: string;
  receiver: string;
  city: string;
  weightKg: number;
  cost: number;
  cod: number;
  status: ShipmentStatus;
  createdAt: string;
};

export type ShipmentDetail = Shipment & { events: ShipmentEvent[] };

export type ShipmentsPage = {
  items: Shipment[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type Stats = Record<ShipmentStatus, number>;

export type NewShipment = {
  receiver: string;
  city: string;
  weightKg: number;
  cod: number;
};
