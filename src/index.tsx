import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import type { CloudflareBindings, MenuItem, ExtraIngredient, Order, Customer, OrderItem } from './types'

type Env = {
  Bindings: CloudflareBindings
}

const app = new Hono<Env>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

app.use(renderer)

// API Routes
app.get('/api/menu', async (c) => {
  const { DB } = c.env
  const result = await DB.prepare(`
    SELECT * FROM menu_items ORDER BY category, name
  `).all()
  return c.json(result.results)
})

app.get('/api/extras', async (c) => {
  const { DB } = c.env
  const result = await DB.prepare(`
    SELECT * FROM extra_ingredients ORDER BY category, name
  `).all()
  return c.json(result.results)
})

app.post('/api/orders', async (c) => {
  const { DB } = c.env
  const orderData: Order = await c.req.json()
  
  try {
    // Start transaction - insert customer
    const customerResult = await DB.prepare(`
      INSERT OR REPLACE INTO customers (name, whatsapp, address, between_streets, neighborhood)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      orderData.customer.name,
      orderData.customer.whatsapp,
      orderData.customer.address || '',
      orderData.customer.between_streets || '',
      orderData.customer.neighborhood || ''
    ).run()
    
    const customerId = customerResult.meta.last_row_id
    
    // Insert order
    const orderResult = await DB.prepare(`
      INSERT INTO orders (customer_id, total_amount, delivery_type, delivery_cost, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).bind(
      customerId,
      orderData.total_amount,
      orderData.delivery_type,
      orderData.delivery_cost
    ).run()
    
    const orderId = orderResult.meta.last_row_id
    
    // Insert order items
    for (const item of orderData.items) {
      await DB.prepare(`
        INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, extras, vegetables, sauces)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        orderId,
        item.menu_item.id,
        item.quantity,
        item.total_price / item.quantity,
        JSON.stringify(item.extras),
        JSON.stringify(item.vegetables),
        JSON.stringify(item.sauces)
      ).run()
    }
    
    // Insert beverages if any
    if (orderData.beverages > 0) {
      await DB.prepare(`
        INSERT INTO beverages (order_id, quantity, unit_price)
        VALUES (?, ?, 30.00)
      `).bind(orderId, orderData.beverages).run()
    }
    
    return c.json({ 
      success: true, 
      orderId,
      whatsappMessage: generateWhatsAppMessage(orderData, orderId as number)
    })
    
  } catch (error) {
    console.error('Error creating order:', error)
    return c.json({ success: false, error: 'Error creating order' }, 500)
  }
})

function generateWhatsAppMessage(order: Order, orderId: number): string {
  let message = `🍔 *GEORGE BURGER* 🍔\n`
  message += `📋 *Pedido #${orderId}*\n\n`
  
  message += `👤 *Cliente:* ${order.customer.name}\n`
  message += `📱 *WhatsApp:* ${order.customer.whatsapp}\n`
  
  if (order.delivery_type === 'delivery') {
    message += `🏠 *Entrega a domicilio*\n`
    message += `📍 *Dirección:* ${order.customer.address}\n`
    if (order.customer.between_streets) {
      message += `🛣️ *Entre calles:* ${order.customer.between_streets}\n`
    }
    if (order.customer.neighborhood) {
      message += `🏘️ *Colonia:* ${order.customer.neighborhood}\n`
    }
  } else {
    message += `🏃 *Para recoger en tienda*\n`
  }
  
  message += `\n📋 *PEDIDO:*\n`
  
  for (const item of order.items) {
    message += `\n${item.quantity}x *${item.menu_item.name}* - $${item.total_price}\n`
    message += `   ${item.menu_item.base_ingredients}\n`
    
    if (item.extras.length > 0) {
      message += `   + Extra: ${item.extras.map(e => e.name).join(', ')}\n`
    }
    
    const selectedVeggies = item.vegetables.map(v => v.name).join(', ')
    const selectedSauces = item.sauces.map(s => s.name).join(', ')
    
    if (selectedVeggies) {
      message += `   🥬 Verduras: ${selectedVeggies}\n`
    }
    if (selectedSauces) {
      message += `   🥄 Aderezos: ${selectedSauces}\n`
    }
  }
  
  if (order.beverages > 0) {
    message += `\n${order.beverages}x *Bebida* - $${order.beverages * 30}\n`
  }
  
  message += `\n💰 *Subtotal:* $${order.total_amount - order.delivery_cost}\n`
  
  if (order.delivery_cost > 0) {
    message += `🚚 *Costo de entrega:* $${order.delivery_cost}\n`
  }
  
  message += `💵 *TOTAL:* $${order.total_amount}\n`
  message += `\n¡Gracias por tu pedido! 🎉`
  
  return message
}

app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-orange-500">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-2">
              🍔 GEORGE BURGER 🍔
            </h1>
            <p className="text-gray-600">Hamburguesas, Hotdogs, Sincronizadas y más</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                🍽️ MENÚ
              </h2>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap justify-center mb-6 gap-2" id="category-tabs">
                <button className="category-btn active bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition" data-category="hamburguesas">
                  🍔 Hamburguesas
                </button>
                <button className="category-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition" data-category="hotdogs">
                  🌭 Hotdogs
                </button>
                <button className="category-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition" data-category="sincronizadas">
                  🌮 Sincronizadas
                </button>
                <button className="category-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition" data-category="tortas">
                  🥪 Tortas
                </button>
                <button className="category-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition" data-category="burros">
                  🌯 Burros
                </button>
              </div>

              {/* Menu Items Container */}
              <div id="menu-container" className="space-y-4">
                <div className="text-center text-gray-500 py-8">
                  <p>Cargando menú...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                🛒 Tu Pedido
              </h2>
              
              <div id="cart-items" className="space-y-3 mb-6">
                <p className="text-gray-500 text-center py-4">Tu carrito está vacío</p>
              </div>
              
              {/* Beverages Section */}
              <div className="border-t pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">🥤 Bebidas ($30 c/u)</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <button id="beverage-decrease" className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600">-</button>
                  <span id="beverage-count" className="font-bold text-lg w-8 text-center">0</span>
                  <button id="beverage-increase" className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-600">+</button>
                </div>
              </div>
              
              {/* Delivery Options */}
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-3">🚚 Opciones de entrega:</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="delivery" value="pickup" className="text-red-500" defaultChecked />
                    <span>🏃 Pasar a recoger (Gratis)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="delivery" value="delivery" className="text-red-500" />
                    <span>🏠 Entrega a domicilio (+$20)</span>
                  </label>
                </div>
              </div>
              
              {/* Customer Info Form */}
              <div id="customer-form" className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-3">👤 Datos del cliente:</h3>
                <div className="space-y-3">
                  <input type="text" id="customer-name" placeholder="Nombre completo" className="w-full p-2 border rounded-lg" required />
                  <input type="tel" id="customer-whatsapp" placeholder="WhatsApp (ej: 5211234567890)" className="w-full p-2 border rounded-lg" required />
                  
                  <div id="delivery-fields" style={{display: 'none'}}>
                    <input type="text" id="customer-address" placeholder="Dirección completa" className="w-full p-2 border rounded-lg" />
                    <input type="text" id="customer-streets" placeholder="Entre qué calles" className="w-full p-2 border rounded-lg" />
                    <input type="text" id="customer-neighborhood" placeholder="Colonia" className="w-full p-2 border rounded-lg" />
                  </div>
                </div>
              </div>
              
              {/* Total */}
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>💵 TOTAL:</span>
                  <span id="cart-total">$0</span>
                </div>
              </div>
              
              {/* Order Button */}
              <button id="place-order" className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition" disabled>
                🛒 HACER PEDIDO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <div id="order-modal" className="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center p-4" style={{zIndex: 1000}}>
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">¡Pedido Realizado! 🎉</h3>
            <p className="mb-4">Tu pedido ha sido enviado por WhatsApp</p>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-left">
              <h4 className="font-bold mb-2">Mensaje enviado:</h4>
              <div id="whatsapp-preview" className="text-sm whitespace-pre-line"></div>
            </div>
            
            <div className="flex space-x-3">
              <button id="send-whatsapp" className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                📱 Abrir WhatsApp
              </button>
              <button id="close-modal" className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <script src="/static/app.js"></script>
    </div>
  )
})

export default app
