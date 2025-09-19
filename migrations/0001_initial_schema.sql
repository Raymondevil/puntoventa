-- Tabla de clientes
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  address TEXT,
  between_streets TEXT,
  neighborhood TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_type TEXT NOT NULL CHECK(delivery_type IN ('delivery', 'pickup')), -- 'delivery' o 'pickup'
  delivery_cost DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Tabla de productos del menú
CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL, -- 'hamburguesas', 'hotdogs', 'sincronizadas', 'tortas', 'burros'
  name TEXT NOT NULL,
  base_ingredients TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ingredientes extras disponibles
CREATE TABLE IF NOT EXISTS extra_ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL, -- 'extra', 'vegetable', 'sauce'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de items del pedido
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  extras TEXT, -- JSON con ingredientes extras seleccionados
  vegetables TEXT, -- JSON con verduras seleccionadas
  sauces TEXT, -- JSON con aderezos seleccionados
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Tabla de bebidas
CREATE TABLE IF NOT EXISTS beverages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) DEFAULT 30.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Indices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_customers_whatsapp ON customers(whatsapp);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);