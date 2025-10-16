// Global state
let menu = [];
let extras = [];
let cart = [];
let beverageCount = 0;
let currentCategory = 'hamburguesas';
let filteredMenu = [];
let searchTerm = '';

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
        b.className = b.className.replace('bg-orange-500 text-white', 'bg-gray-600 text-gray-300');
      });
      this.className = this.className.replace('bg-gray-600 text-gray-300', 'bg-orange-500 text-white');
      
      currentCategory = this.dataset.category;
      
      // Clear search when changing category
      clearSearch();
      
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
  
  // Search functionality
  document.getElementById('search-input').addEventListener('input', handleSearch);
  document.getElementById('clear-search').addEventListener('click', clearSearch);
}

// Handle search functionality
function handleSearch(event) {
  searchTerm = event.target.value.toLowerCase().trim();
  const clearButton = document.getElementById('clear-search');
  
  if (searchTerm.length > 0) {
    clearButton.classList.remove('hidden');
    // Search across all categories
    filteredMenu = menu.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.base_ingredients.toLowerCase().includes(searchTerm)
    );
    renderSearchResults();
  } else {
    clearButton.classList.add('hidden');
    filteredMenu = [];
    renderMenu();
  }
}

// Clear search
function clearSearch() {
  document.getElementById('search-input').value = '';
  document.getElementById('clear-search').classList.add('hidden');
  searchTerm = '';
  filteredMenu = [];
  renderMenu();
}

// Render search results
function renderSearchResults() {
  const container = document.getElementById('menu-container');
  
  if (filteredMenu.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-400 py-8"><p>No se encontraron productos con "' + searchTerm + '"</p></div>';
    return;
  }
  
  const html = `
    <div class="mb-4 text-center">
      <p class="text-orange-400 font-semibold">📍 Resultados de búsqueda para "${searchTerm}" (${filteredMenu.length} productos)</p>
    </div>
    ${filteredMenu.map(item => generateMenuItemHTML(item)).join('')}
  `;
  
  container.innerHTML = html;
  
  // Add event listeners to checkboxes
  container.querySelectorAll('.extra-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => updateItemPrice(checkbox.dataset.itemId));
  });
}

// Render menu items for current category
function renderMenu() {
  const container = document.getElementById('menu-container');
  
  // If there's a search active, show search results instead
  if (searchTerm.length > 0) {
    renderSearchResults();
    return;
  }
  
  const categoryItems = menu.filter(item => item.category === currentCategory);
  
  if (categoryItems.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-400 py-8"><p>No hay productos en esta categoría</p></div>';
    return;
  }
  
  const html = categoryItems.map(item => generateMenuItemHTML(item)).join('');
  
  container.innerHTML = html;
  
  // Add event listeners to checkboxes for price calculation
  container.querySelectorAll('.extra-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => updateItemPrice(checkbox.dataset.itemId));
  });
}

// Generate HTML for a menu item
function generateMenuItemHTML(item) {
  return `
    <div class="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-600 transition">
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <h3 class="font-bold text-lg text-white">${item.name}</h3>
          <p class="text-sm text-gray-300 mb-2">${item.base_ingredients}</p>
          <p class="font-bold text-orange-400 text-lg">$${item.base_price}</p>
        </div>
      </div>
      
      <div class="space-y-3">
        <!-- Extras Section - Collapsible -->
        <div>
          <button class="w-full text-left font-semibold text-sm mb-2 bg-orange-600 text-white p-2 rounded flex items-center justify-between hover:bg-orange-500 transition" onclick="toggleExtras(${item.id})">
            <span>🍖 Agregar Ingredientes Extra (Opcional)</span>
            <span id="extras-arrow-${item.id}" class="transform transition-transform">▼</span>
          </button>
          <div id="extras-container-${item.id}" class="hidden grid grid-cols-2 gap-2 text-sm p-2 bg-gray-600 border border-gray-500 rounded">
            ${getExtrasForCategory('extra').map(extra => `
              <label class="flex items-center space-x-1 text-gray-300">
                <input type="checkbox" class="extra-checkbox accent-orange-500" data-item-id="${item.id}" data-extra-id="${extra.id}" data-price="${extra.price}">
                <span>${extra.name} (+$${extra.price})</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Vegetables and Sauces Combined -->
        <div class="bg-green-700 p-3 rounded border border-green-600">
          <h4 class="font-semibold text-sm mb-2 text-green-200">🥬 Verduras y Aderezos (Incluidos - puedes quitar los que no desees):</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            ${getExtrasForCategory('vegetable').map(veggie => `
              <label class="flex items-center space-x-1 text-green-200">
                <input type="checkbox" class="vegetable-checkbox accent-green-500" data-item-id="${item.id}" data-extra-id="${veggie.id}" checked>
                <span>${veggie.name}</span>
              </label>
            `).join('')}
            ${getExtrasForCategory('sauce').map(sauce => `
              <label class="flex items-center space-x-1 text-green-200">
                <input type="checkbox" class="sauce-checkbox accent-green-500" data-item-id="${item.id}" data-extra-id="${sauce.id}" checked>
                <span>${sauce.name}</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Quantity and Add Button -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-600">
          <div class="flex items-center space-x-3">
            <span class="font-semibold text-gray-300">Cantidad:</span>
            <button class="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600" onclick="changeQuantity(${item.id}, -1)">-</button>
            <span class="font-bold text-lg w-8 text-center text-white" id="quantity-${item.id}">1</span>
            <button class="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-600" onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onclick="addToCart(${item.id})">
            🛒 Agregar
          </button>
        </div>
      </div>
    </div>
  `;
}

// Get extras by category
function getExtrasForCategory(category) {
  return extras.filter(extra => extra.category === category);
}

// Toggle extras section
function toggleExtras(itemId) {
  const container = document.getElementById(`extras-container-${itemId}`);
  const arrow = document.getElementById(`extras-arrow-${itemId}`);
  
  if (container.classList.contains('hidden')) {
    container.classList.remove('hidden');
    arrow.style.transform = 'rotate(180deg)';
  } else {
    container.classList.add('hidden');
    arrow.style.transform = 'rotate(0deg)';
  }
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
  
  // Collapse extras section
  const extrasContainer = document.getElementById(`extras-container-${itemId}`);
  const extrasArrow = document.getElementById(`extras-arrow-${itemId}`);
  if (extrasContainer) {
    extrasContainer.classList.add('hidden');
    extrasArrow.style.transform = 'rotate(0deg)';
  }
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
      <div class="border-b border-gray-600 pb-3 mb-3">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h4 class="font-semibold text-white">${item.quantity}x ${item.menu_item.name}</h4>
            <p class="text-sm text-gray-400">${item.menu_item.base_ingredients}</p>
            ${item.extras.length > 0 ? `<p class="text-xs text-orange-400 font-medium">+ Extras: ${item.extras.map(e => e.name).join(', ')}</p>` : ''}
            ${(item.vegetables.length > 0 || item.sauces.length > 0) ? `<p class="text-xs text-green-400">🥬 ${[...item.vegetables.map(v => v.name), ...item.sauces.map(s => s.name)].join(', ')}</p>` : ''}
          </div>
          <div class="text-right">
            <p class="font-bold text-orange-400">$${item.total_price}</p>
            <button class="text-red-400 text-sm hover:text-red-300" onclick="removeFromCart(${index})">
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
      <div class="border-b border-gray-600 pb-3 mb-3">
        <div class="flex justify-between items-center">
          <span class="font-semibold text-white">${beverageCount}x Bebida</span>
          <span class="font-bold text-orange-400">$${beverageTotal}</span>
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