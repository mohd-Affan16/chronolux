// Global State
let cart = JSON.parse(localStorage.getItem('chronolux_cart')) || [];

// DOM Elements
const cartToggle = document.getElementById('cartToggle');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');

const chatFab = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const closeChatBtn = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  setupIntersectionObservers();
  if (document.getElementById('productGrid')) {
    fetchProducts();
  }
});

// Cart Logic
function updateCartUI() {
  if (!cartBadge) return;
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartBadge.textContent = count;
  if (count > 0) {
    cartBadge.classList.remove('opacity-0');
  } else {
    cartBadge.classList.add('opacity-0');
  }

  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      cartItemsContainer.innerHTML += `
        <div class="flex items-center space-x-4 bg-midnight p-3 border border-gold/20 rounded">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
          <div class="flex-1">
            <h4 class="text-sm font-serif text-gold truncate w-40">${item.name}</h4>
            <p class="text-xs text-gray-400">₹${item.price.toLocaleString()}</p>
          </div>
          <button onclick="removeFromCart(${index})" class="text-gray-500 hover:text-red-500">&times;</button>
        </div>
      `;
    });
    cartTotalElement.textContent = `₹${total.toLocaleString()}`;
  }
}

function addToCart(productStr) {
  const product = JSON.parse(decodeURIComponent(productStr));
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('chronolux_cart', JSON.stringify(cart));
  updateCartUI();
  openCart();
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  localStorage.setItem('chronolux_cart', JSON.stringify(cart));
  updateCartUI();
};

function openCart() {
  if(!cartDrawer) return;
  cartDrawer.classList.remove('translate-x-full');
  cartOverlay.classList.remove('hidden');
  setTimeout(() => cartOverlay.classList.remove('opacity-0'), 10);
}

function closeCart() {
  if(!cartDrawer) return;
  cartDrawer.classList.add('translate-x-full');
  cartOverlay.classList.add('opacity-0');
  setTimeout(() => cartOverlay.classList.add('hidden'), 300);
}

if (cartToggle) cartToggle.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Fetch Products
async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    const grid = document.getElementById('productGrid');
    
    products.forEach(p => {
      const pStr = encodeURIComponent(JSON.stringify(p));
      const card = document.createElement('div');
      card.className = "bg-midnight border border-gold/20 hover:border-gold/60 transition-colors duration-500 fade-in p-6 group cursor-pointer";
      card.innerHTML = `
        <div class="overflow-hidden mb-6 h-64 relative">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
        </div>
        <h3 class="font-serif text-xl text-gold mb-2">${p.name}</h3>
        <p class="text-sm text-gray-400 mb-6 h-10 overflow-hidden">${p.description}</p>
        <div class="flex justify-between items-center border-t border-gold/20 pt-4">
          <span class="text-lg tracking-widest">₹${p.price.toLocaleString()}</span>
          <button onclick="addToCart('${pStr}')" class="text-xs uppercase tracking-widest border border-gold text-gold px-4 py-2 hover:bg-gold hover:text-midnight transition-colors">Add</button>
        </div>
      `;
      grid.appendChild(card);
    });
    
    // Re-trigger observer for new elements
    setupIntersectionObservers();
  } catch (err) {
    console.error("Failed to load products", err);
  }
}

// Fade-in Observer
function setupIntersectionObservers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// AI Concierge Chat Logic
if (chatFab) {
  chatFab.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    chatWindow.classList.toggle('flex');
  });
}
if (closeChatBtn) {
  closeChatBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
    chatWindow.classList.remove('flex');
  });
}

async function sendMessage() {
  if(!chatInput || !chatInput.value.trim()) return;
  const msg = chatInput.value.trim();
  chatInput.value = '';
  
  // Append user message
  chatMessages.innerHTML += `
    <div class="flex justify-end mb-2">
      <div class="bg-gold text-midnight p-3 rounded-bl-none rounded-lg text-xs w-10/12">
        ${msg}
      </div>
    </div>
  `;
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    
    // Append AI reply
    setTimeout(() => {
      chatMessages.innerHTML += `
        <div class="flex justify-start mb-2">
          <div class="bg-midnight border border-gold/20 p-3 rounded-br-none rounded-lg text-gray-300 text-xs w-11/12">
            ${data.reply}
          </div>
        </div>
      `;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500); // slight delay for realism
  } catch (err) {
    console.error(err);
  }
}

if (chatSend) chatSend.addEventListener('click', sendMessage);
if (chatInput) chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Contact Form Logic
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    btn.textContent = 'Sending...';
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch('/api/contact-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      alert(result.status || "Message sent!");
      contactForm.reset();
    } catch(err) {
      alert("Error sending message");
    } finally {
      btn.textContent = 'Send Inquiry';
    }
  });
}

// Checkout Logic
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
  const checkoutItems = document.getElementById('checkoutItems');
  const checkoutTotal = document.getElementById('checkoutTotal');
  
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
    checkoutItems.innerHTML += `
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-300">${item.quantity}x ${item.name}</span>
        <span class="text-gold">₹${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `;
  });
  checkoutTotal.textContent = `₹${total.toLocaleString()}`;

  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const btn = document.getElementById('payBtn');
    btn.textContent = 'Processing...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, total })
      });
      const data = await res.json();
      
      document.getElementById('paymentSuccess').classList.remove('hidden');
      checkoutForm.classList.add('hidden');
      
      localStorage.removeItem('chronolux_cart');
      cart = [];
      updateCartUI();
      
      document.getElementById('orderRef').textContent = data.orderId;
    } catch (err) {
      alert("Payment failed");
      btn.textContent = 'Complete Purchase';
      btn.disabled = false;
    }
  });
}
