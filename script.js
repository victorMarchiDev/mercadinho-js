const catalogContainer = document.getElementById('product-catalog');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

let cart = [];
loadCartFromLocalStorage();
renderCart();

async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    catalogContainer.innerHTML = '<p>Erro ao carregar produtos.</p>';
  }
}

function renderProducts(products) {
  catalogContainer.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h2 class="product-title">${product.title}</h2>
      <p class="product-price">R$ ${product.price.toFixed(2)}</p>
      <p class="product-description">${product.description}</p>
      <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Adicionar ao Carrinho</button>
    `;

    catalogContainer.appendChild(card);
  });
}

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}


function addToCart(id, title, price) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, title, price, quantity: 1 });
  }

  renderCart();
  saveCartToLocalStorage();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
  saveCartToLocalStorage();
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    total += item.price * item.quantity;

    li.innerHTML = `
      ${item.title} x${item.quantity} 
      <button onclick="removeFromCart(${item.id})">Remover</button>
    `;
    cartItemsContainer.appendChild(li);
  });

  cartTotalElement.textContent = total.toFixed(2);
}

checkoutButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const selectedPayment = document.querySelector('input[name="payment"]:checked');
  if (!selectedPayment) {
    alert("Selecione uma forma de pagamento para continuar.");
    return;
  }

  const paymentMethod = selectedPayment.value;
  let metodoTexto = '';

  switch (paymentMethod) {
    case 'cartao':
      metodoTexto = 'Cartão de Crédito';
      break;
    case 'pix':
      metodoTexto = 'PIX';
      break;
    case 'boleto':
      metodoTexto = 'Boleto';
      break;
  }

  alert(`Compra finalizada com sucesso via ${metodoTexto}!\nObrigado pela preferência. 🎉`);

  cart = [];
  renderCart();
  saveCartToLocalStorage();
  document.querySelectorAll('input[name="payment"]').forEach(input => input.checked = false);
});


const cartElement = document.querySelector('.cart');
const toggleCartBtn = document.getElementById('toggle-cart');

toggleCartBtn.addEventListener('click', () => {
  cartElement.classList.toggle('open');
});

const closeCartBtn = document.getElementById('close-cart');

closeCartBtn.addEventListener('click', () => {
  cartElement.classList.remove('open');
});


fetchProducts();
