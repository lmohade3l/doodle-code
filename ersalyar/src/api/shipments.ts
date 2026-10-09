import { client } from './client';
import type { NewShipment, Shipment, ShipmentDetail, ShipmentsPage, Stats } from '../types';

export const PAGE_SIZE = 10;

export async function fetchShipments(params: { status: string; q: string; page: number }) {
  const { data } = await client.get<ShipmentsPage>('/shipments', {
    params: { ...params, pageSize: PAGE_SIZE },
  });
  return data;
}

export async function fetchShipment(id: string) {
  const { data } = await client.get<ShipmentDetail>(`/shipments/${id}`);
  return data;
}

export async function fetchStats() {
  const { data } = await client.get<Stats>('/stats');
  return data;
}

export async function cancelShipment(id: string) {
  const { data } = await client.post<Shipment>(`/shipments/${id}/cancel`);
  return data;
}

export async function createShipment(body: NewShipment) {
  const { data } = await client.post<Shipment>('/shipments', body);
  return data;
}
