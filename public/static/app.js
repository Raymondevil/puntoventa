// Global state
let menu = [];
let extras = [];
let cart = [];
let beverageCount = 0;
let currentCategory = 'hamburguesas';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  await loadData();
  setupEventListeners();
  renderMenu();
  updateCart();
});

// Load menu and extras data
async function loadData() {
  try {
    const [menuResponse, extrasResponse] = await Promise.all([
      fetch('/api/menu'),
      fetch('/api/extras')
    ]);
    
    menu = await menuResponse.json();
    extras = await extrasResponse.json();
    
    console.log('Menu loaded:', menu.length, 'items');
    console.log('Extras loaded:', extras.length, 'items');
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.category-btn').forEach(b => {
        b.className = b.className.replace('bg-red-500 text-white', 'bg-gray-200 text-gray-700');
      });
      this.className = this.className.replace('bg-gray-200 text-gray-700', 'bg-red-500 text-white');
      
      currentCategory = this.dataset.category;
      renderMenu();
    });
  });
  
  // Beverage controls
  document.getElementById('beverage-decrease').addEventListener('click', () => {
    if (beverageCount > 0) {
      beverageCount--;
      updateBeverageDisplay();
      updateCart();
    }
  });
  
  document.getElementById('beverage-increase').addEventListener('click', () => {
    beverageCount++;
    updateBeverageDisplay();
    updateCart();
  });
  
  // Delivery type change
  document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const deliveryFields = document.getElementById('delivery-fields');
      if (this.value === 'delivery') {
        deliveryFields.style.display = 'block';
      } else {
        deliveryFields.style.display = 'none';
      }
      updateCart();
    });
  });
  
  // Customer form validation
  document.querySelectorAll('#customer-name, #customer-whatsapp').forEach(input => {
    input.addEventListener('input', validateForm);
  });
  
  // Place order button
  document.getElementById('place-order').addEventListener('click', placeOrder);
  
  // Modal controls
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('send-whatsapp').addEventListener('click', sendWhatsApp);
}

// Render menu items for current category
function renderMenu() {
  const container = document.getElementById('menu-container');
  const categoryItems = menu.filter(item => item.category === currentCategory);
  
  if (categoryItems.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-500 py-8"><p>No hay productos en esta categoría</p></div>';
    return;
  }
  
  const html = categoryItems.map(item => `
    <div class="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition">
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <h3 class="font-bold text-lg text-gray-800">${item.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${item.base_ingredients}</p>
          <p class="font-bold text-red-600 text-lg">$${item.base_price}</p>
        </div>
      </div>
      
      <div class="space-y-3">
        <!-- Extras Section -->
        <div>
          <h4 class="font-semibold text-sm mb-2">🍖 Ingredientes Extra:</h4>
          <div class="grid grid-cols-2 gap-2 text-sm" id="extras-${item.id}">
            ${getExtrasForCategory('extra').map(extra => `
              <label class="flex items-center space-x-1">
                <input type="checkbox" class="extra-checkbox" data-item-id="${item.id}" data-extra-id="${extra.id}" data-price="${extra.price}">
                <span>${extra.name} (+$${extra.price})</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Vegetables Section -->
        <div>
          <h4 class="font-semibold text-sm mb-2">🥬 Verduras (incluidas):</h4>
          <div class="grid grid-cols-2 gap-2 text-sm" id="vegetables-${item.id}">
            ${getExtrasForCategory('vegetable').map(veggie => `
              <label class="flex items-center space-x-1">
                <input type="checkbox" class="vegetable-checkbox" data-item-id="${item.id}" data-extra-id="${veggie.id}" checked>
                <span>${veggie.name}</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Sauces Section -->
        <div>
          <h4 class="font-semibold text-sm mb-2">🥄 Aderezos (incluidos):</h4>
          <div class="grid grid-cols-2 gap-2 text-sm" id="sauces-${item.id}">
            ${getExtrasForCategory('sauce').map(sauce => `
              <label class="flex items-center space-x-1">
                <input type="checkbox" class="sauce-checkbox" data-item-id="${item.id}" data-extra-id="${sauce.id}" checked>
                <span>${sauce.name}</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Quantity and Add Button -->
        <div class="flex items-center justify-between pt-3 border-t">
          <div class="flex items-center space-x-3">
            <span class="font-semibold">Cantidad:</span>
            <button class="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600" onclick="changeQuantity(${item.id}, -1)">-</button>
            <span class="font-bold text-lg w-8 text-center" id="quantity-${item.id}">1</span>
            <button class="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-600" onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onclick="addToCart(${item.id})">
            🛒 Agregar
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
  
  // Add event listeners to checkboxes for price calculation
  container.querySelectorAll('.extra-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => updateItemPrice(checkbox.dataset.itemId));
  });
}

// Get extras by category
function getExtrasForCategory(category) {
  return extras.filter(extra => extra.category === category);
}

// Change quantity for menu item
function changeQuantity(itemId, change) {
  const quantityElement = document.getElementById(`quantity-${itemId}`);
  let quantity = parseInt(quantityElement.textContent);
  quantity = Math.max(1, quantity + change);
  quantityElement.textContent = quantity;
  updateItemPrice(itemId);
}

// Update item price display based on selected extras and quantity
function updateItemPrice(itemId) {
  const item = menu.find(m => m.id == itemId);
  if (!item) return;
  
  const quantity = parseInt(document.getElementById(`quantity-${itemId}`).textContent);
  const selectedExtras = Array.from(document.querySelectorAll(`input[data-item-id="${itemId}"].extra-checkbox:checked`));
  
  let totalExtrasPrice = selectedExtras.reduce((sum, checkbox) => {
    return sum + parseFloat(checkbox.dataset.price);
  }, 0);
  
  const totalPrice = (item.base_price + totalExtrasPrice) * quantity;
  // You could display this price somewhere if needed
}

// Add item to cart
function addToCart(itemId) {
  const item = menu.find(m => m.id == itemId);
  if (!item) return;
  
  const quantity = parseInt(document.getElementById(`quantity-${itemId}`).textContent);
  
  // Get selected extras
  const selectedExtras = Array.from(document.querySelectorAll(`input[data-item-id="${itemId}"].extra-checkbox:checked`))
    .map(checkbox => {
      const extraId = parseInt(checkbox.dataset.extraId);
      return extras.find(e => e.id === extraId);
    }).filter(Boolean);
  
  // Get selected vegetables
  const selectedVegetables = Array.from(document.querySelectorAll(`input[data-item-id="${itemId}"].vegetable-checkbox:checked`))
    .map(checkbox => {
      const extraId = parseInt(checkbox.dataset.extraId);
      return extras.find(e => e.id === extraId);
    }).filter(Boolean);
  
  // Get selected sauces
  const selectedSauces = Array.from(document.querySelectorAll(`input[data-item-id="${itemId}"].sauce-checkbox:checked`))
    .map(checkbox => {
      const extraId = parseInt(checkbox.dataset.extraId);
      return extras.find(e => e.id === extraId);
    }).filter(Boolean);
  
  // Calculate total price for this item
  const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const totalPrice = (item.base_price + extrasPrice) * quantity;
  
  // Add to cart
  const cartItem = {
    menu_item: item,
    quantity,
    extras: selectedExtras,
    vegetables: selectedVegetables,
    sauces: selectedSauces,
    total_price: totalPrice
  };
  
  cart.push(cartItem);
  updateCart();
  
  // Reset form
  document.getElementById(`quantity-${itemId}`).textContent = '1';
  document.querySelectorAll(`input[data-item-id="${itemId}"].extra-checkbox`).forEach(cb => cb.checked = false);
  document.querySelectorAll(`input[data-item-id="${itemId}"].vegetable-checkbox`).forEach(cb => cb.checked = true);
  document.querySelectorAll(`input[data-item-id="${itemId}"].sauce-checkbox`).forEach(cb => cb.checked = true);
}

// Update cart display
function updateCart() {
  const cartContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  if (cart.length === 0 && beverageCount === 0) {
    cartContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Tu carrito está vacío</p>';
    cartTotal.textContent = '$0';
    document.getElementById('place-order').disabled = true;
    return;
  }
  
  let html = '';
  let subtotal = 0;
  
  // Cart items
  cart.forEach((item, index) => {
    html += `
      <div class="border-b pb-3 mb-3">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h4 class="font-semibold">${item.quantity}x ${item.menu_item.name}</h4>
            <p class="text-sm text-gray-600">${item.menu_item.base_ingredients}</p>
            ${item.extras.length > 0 ? `<p class="text-xs text-blue-600">+ ${item.extras.map(e => e.name).join(', ')}</p>` : ''}
            ${item.vegetables.length > 0 ? `<p class="text-xs text-green-600">🥬 ${item.vegetables.map(v => v.name).join(', ')}</p>` : ''}
            ${item.sauces.length > 0 ? `<p class="text-xs text-orange-600">🥄 ${item.sauces.map(s => s.name).join(', ')}</p>` : ''}
          </div>
          <div class="text-right">
            <p class="font-bold">$${item.total_price}</p>
            <button class="text-red-500 text-sm hover:text-red-700" onclick="removeFromCart(${index})">
              🗑️ Quitar
            </button>
          </div>
        </div>
      </div>
    `;
    subtotal += item.total_price;
  });
  
  // Beverages
  if (beverageCount > 0) {
    const beverageTotal = beverageCount * 30;
    html += `
      <div class="border-b pb-3 mb-3">
        <div class="flex justify-between items-center">
          <span class="font-semibold">${beverageCount}x Bebida</span>
          <span class="font-bold">$${beverageTotal}</span>
        </div>
      </div>
    `;
    subtotal += beverageTotal;
  }
  
  cartContainer.innerHTML = html;
  
  // Calculate total with delivery
  const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
  const deliveryCost = deliveryType === 'delivery' ? 20 : 0;
  const total = subtotal + deliveryCost;
  
  cartTotal.textContent = `$${total}`;
  
  // Enable order button if cart has items and form is valid
  validateForm();
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Update beverage display
function updateBeverageDisplay() {
  document.getElementById('beverage-count').textContent = beverageCount;
}

// Validate form and enable/disable order button
function validateForm() {
  const name = document.getElementById('customer-name').value.trim();
  const whatsapp = document.getElementById('customer-whatsapp').value.trim();
  const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
  
  let isValid = name !== '' && whatsapp !== '' && (cart.length > 0 || beverageCount > 0);
  
  if (deliveryType === 'delivery') {
    const address = document.getElementById('customer-address').value.trim();
    isValid = isValid && address !== '';
  }
  
  document.getElementById('place-order').disabled = !isValid;
}

// Place order
async function placeOrder() {
  const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
  const deliveryCost = deliveryType === 'delivery' ? 20 : 0;
  
  const customer = {
    name: document.getElementById('customer-name').value.trim(),
    whatsapp: document.getElementById('customer-whatsapp').value.trim(),
    address: document.getElementById('customer-address').value.trim(),
    between_streets: document.getElementById('customer-streets').value.trim(),
    neighborhood: document.getElementById('customer-neighborhood').value.trim()
  };
  
  const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0) + (beverageCount * 30);
  const total = subtotal + deliveryCost;
  
  const order = {
    customer,
    items: cart,
    beverages: beverageCount,
    delivery_type: deliveryType,
    delivery_cost: deliveryCost,
    total_amount: total
  };
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show confirmation modal
      document.getElementById('whatsapp-preview').textContent = result.whatsappMessage;
      document.getElementById('order-modal').classList.remove('hidden');
      
      // Store WhatsApp message for sending
      window.currentWhatsAppMessage = result.whatsappMessage;
      
      // Clear cart
      cart = [];
      beverageCount = 0;
      updateBeverageDisplay();
      updateCart();
      
      // Clear form
      document.getElementById('customer-name').value = '';
      document.getElementById('customer-whatsapp').value = '';
      document.getElementById('customer-address').value = '';
      document.getElementById('customer-streets').value = '';
      document.getElementById('customer-neighborhood').value = '';
      document.querySelector('input[name="delivery"][value="pickup"]').checked = true;
      document.getElementById('delivery-fields').style.display = 'none';
      
    } else {
      alert('Error al crear el pedido: ' + (result.error || 'Error desconocido'));
    }
    
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Error al crear el pedido. Por favor intenta de nuevo.');
  }
}

// Send WhatsApp message
function sendWhatsApp() {
  if (window.currentWhatsAppMessage) {
    const whatsappNumber = '523111235595';
    const encodedMessage = encodeURIComponent(window.currentWhatsAppMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  }
}

// Close modal
function closeModal() {
  document.getElementById('order-modal').classList.add('hidden');
  window.currentWhatsAppMessage = null;
}