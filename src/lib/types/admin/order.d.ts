/* eslint-disable @typescript-eslint/no-explicit-any */
interface StatusValue {
  value: number;
  label: string;
}

interface User {
  id: number;
  display_name: string;
  email: string;
  phone: string;
  phone_code: string;
}

interface Order {
  id: number;
  order_no: string;
  provider_type: string | null;
  device_type: string;
  quantity: number;
}

interface Metadata {
  expected_codes: number;
  total_products: number;
  responses_count: number;
  successful_codes: number;
  successful_products: number;
}

interface CardSource {
  id: number;
  name: string;
  class: string;
  config: string;
  is_active: number;
}

interface OrderLog {
  id: number;
  card_source_id: number;
  card_source_name: string;
  codes_count: number;
  codes_generated: any[];
  created_at: string;
  current_status: StatusValue;
  error: string | null;
  event_type: StatusValue;
  has_error: boolean;
  human_date: string;
  ip_address: string;
  metadata: Metadata;
  order_id: number;
  order_no: string;
  payload: any | null;
  response: any | null;
  status_from: any | null;
  status_to: any | null;
  user_agent: string;
  user_id: number;
  card_source: CardSource;
  order: Order;
  user: User;
}

export type { OrderLog, StatusValue, User, Order, Metadata, CardSource };
