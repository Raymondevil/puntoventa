export interface MenuItem {
  id: number;
  category: string;
  name: string;
  base_ingredients: string;
  base_price: number;
}

export interface ExtraIngredient {
  id: number;
  name: string;
  price: number;
  category: 'extra' | 'vegetable' | 'sauce';
}

export interface OrderItem {
  menu_item: MenuItem;
  quantity: number;
  extras: ExtraIngredient[];
  vegetables: ExtraIngredient[];
  sauces: ExtraIngredient[];
  total_price: number;
}

export interface Customer {
  name: string;
  whatsapp: string;
  address?: string;
  between_streets?: string;
  neighborhood?: string;
}

export interface Order {
  customer: Customer;
  items: OrderItem[];
  beverages: number;
  delivery_type: 'delivery' | 'pickup';
  delivery_cost: number;
  total_amount: number;
}

export interface CloudflareBindings {
  DB: D1Database;
}