import axios from 'axios';
import { client } from './client';
import type { User } from '../types';

export type LoginResponse = { accessToken: string; refreshToken: string; user: User };

export async function login(username: string, password: string) {
  const { data } = await axios.post<LoginResponse>('/api/auth/login', { username, password });
  return data;
}

export async function fetchMe() {
  const { data } = await client.get<User>('/me');
  return data;
}
