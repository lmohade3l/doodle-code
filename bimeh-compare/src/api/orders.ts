import { client } from './client';
import type { NewOrder, Order } from '../types';

export async function fetchOrders() {
  const { data } = await client.get<Order[]>('/orders');
  return data;
}

export async function createOrder(order: NewOrder) {
  const { data } = await client.post<Order>('/orders', order);
  return data;
}
