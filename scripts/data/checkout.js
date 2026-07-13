import { formatCurrency } from "./money.js";
import { cart, removeFromCart, setDeliveryOption, updateCartItem } from "./cart.js";
import { products } from "./products.js";
import { placeOrder } from "./orders.js";

const orderDate = new Date();
const dateOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
};//done

const shippingOptions = [
  { days: 7, label: 'FREE Delivery', price: 0 },
  { days: 5, label: 'Standard Delivery-$4.99', price: 4.99 },
  { days: 3, label: 'Express Delivery-$9.99', price: 9.99 }
];//done

function getDeliveryDateText(daysFromOrder) {
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + daysFromOrder);
  return deliveryDate.toLocaleDateString('en-US', dateOptions);
}//done

function getProductOptions(product) {
  const name = product.name.toLowerCase();

  if (Array.isArray(product.sizes) || Array.isArray(product.colors)) {
    return {
      sizes: Array.isArray(product.sizes) ? product.sizes : [],
      colors: Array.isArray(product.colors) ? product.colors : []
    };
  }

  if (name.includes('shoe') || name.includes('sneaker') || name.includes('slipper')) {
    return {
      sizes: ['38', '39', '42', '43', '44'],
      colors: ['White', 'Black', 'Gray']
    };
  }

  if (name.includes('shirt') || name.includes('hoodie') || name.includes('jacket') || name.includes('pant') || name.includes('trouser') || name.includes('curtain') || name.includes('towel') || name.includes('hat')) {
    return {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Black', 'Red']
    };
  }

  if (name.includes('sock')) {
    return {
      sizes: [],
      colors: ['White', 'Black', 'Blue']
    };
  }

  if (name.includes('watch') || name.includes('earring') || name.includes('glass') || name.includes('eyecover') || name.includes('capo')) {
    return {
      sizes: [],
      colors: ['Black', 'Brown', 'Silver']
    };
  }

  return {
    sizes: [],
    colors: ['Black', 'Blue', 'White']
  };
}//done

function buildDeliveryOptionHTML(itemKey, option, checked, cartIndex) {
  const deliveryDateText = getDeliveryDateText(option.days);
  return `
    <div class="option">
      <input
        class="JS-delivery-option"
        type="radio"
        id="delivery-${itemKey}-${option.days}"
        name="delivery-${itemKey}"
        value="${option.label}"
        data-item-key="${itemKey}"
        data-cart-index="${cartIndex}"
        data-delivery-days="${option.days}"
        ${checked ? 'checked' : ''}
      >
      <label for="delivery-${itemKey}-${option.days}">${deliveryDateText}</label>
      <p>${option.label}</p>
    </div>`;
}//done

function buildSizeOptionsHTML(index, sizes, selectedSize) {
  if (!sizes.length) return '';
  return `<div class="size-picker">${sizes.map((size) => `
    <label class="size-label">
      <input type="radio" name="size-${index}" value="${size}" ${size === selectedSize ? 'checked' : ''}>
      <span>${size}</span>
    </label>
  `).join('')}</div>`;
}

function buildColorOptionsHTML(index, colors, selectedColor) {
  if (!colors.length) return '';
  const colorMap = {
    black: '#000000',
    white: '#ffffff',
    blue: '#1e88e5',
    gray: '#6c757d',
    brown: '#8d6e63',
    silver: '#c0c0c0',
    green: '#4caf50',
    yellow: '#fdd835',
    red: '#e53935'
  };
  return `<div class="color-picker">${colors.map((color) => {
    const swatch = colorMap[color.toLowerCase()] || color.toLowerCase();
    return `
      <label class="color-label" title="${color}">
        <input type="radio" name="color-${index}" value="${color}" ${color === selectedColor ? 'checked' : ''}>
        <span class="color-indicator" style="background:${swatch};"></span>
      </label>`;
  }).join('')}</div>`;
}

function buildQuantitySelect(index, quantity) {
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return `
    <select class="JS-edit-quantity" data-index="${index}">
      ${values.map((value) => `<option value="${value}" ${value === quantity ? 'selected' : ''}>${value}</option>`).join('')}
    </select>`;
}//done

function getSelectedShippingOption(cartItem) {
  return shippingOptions.find((option) => option.label === (cartItem.deliveryOption || shippingOptions[0].label)) || shippingOptions[0];
}//done

function calculateItemsPrice() {
  return cart.reduce((sum, cartItem) => {
    const product = products.find((item) => item.id === cartItem.productId);
    if (!product) return sum;
    return sum + (product.price / 100) * cartItem.quantity;
  }, 0);
}//done

function calculateShipping() {
  return cart.reduce((sum, cartItem) => sum + getSelectedShippingOption(cartItem).price, 0);
}//done

function calculateTax(totalBeforeTax) {
  return totalBeforeTax * 0.1;
}//done

function calculateOrderTotal(totalBeforeTax) {
  return totalBeforeTax + calculateTax(totalBeforeTax);
}//done

function formatAmount(value) {
  return value.toFixed(2);
}//done

function updateOrderSummary() {
  const itemsPrice = calculateItemsPrice();
  const shipping = calculateShipping();
  const totalBeforeTax = itemsPrice + shipping;
  const tax = calculateTax(totalBeforeTax);
  const orderTotal = calculateOrderTotal(totalBeforeTax);

  const checkoutCountElement = document.querySelector('.JS-checkout-count');
  if (checkoutCountElement) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    checkoutCountElement.textContent = totalItems;
  }

  const itemsPriceElement = document.querySelector('.JS-items-price');
  const shippingElement = document.querySelector('.JS-shipping');
  const totalBeforeTaxElement = document.querySelector('.JS-total-before-tax');
  const taxElement = document.querySelector('.JS-estimated-tax');
  const orderTotalElement = document.querySelector('.JS-order-total');

  if (itemsPriceElement) itemsPriceElement.textContent = `$${formatAmount(itemsPrice)}`;
  if (shippingElement) shippingElement.textContent = `$${formatAmount(shipping)}`;
  if (totalBeforeTaxElement) totalBeforeTaxElement.textContent = `$${formatAmount(totalBeforeTax)}`;
  if (taxElement) taxElement.textContent = `$${formatAmount(tax)}`;
  if (orderTotalElement) orderTotalElement.textContent = `$${formatAmount(orderTotal)}`;
}//done

function renderCart() {
  const cartSummary = document.querySelector('.JS-order-summary');
  if (!cartSummary) return;

  cartSummary.innerHTML = cart.map((cartItem, index) => {
    const product = products.find((item) => item.id === cartItem.productId);
    if (!product) return '';

    const { sizes, colors } = getProductOptions(product);
    const selectedSize = cartItem.size || sizes[0] || 'N/A';
    const selectedColor = cartItem.color || colors[0] || 'N/A';
    const quantity = cartItem.quantity || 1;
    const itemKey = `item-${index}`;
    const selectedShippingOption = getSelectedShippingOption(cartItem);
    const deliveryDateText = getDeliveryDateText(selectedShippingOption.days);

    return `
      <div class="item JS-cart-item-container" data-cart-index="${index}">
        <p class="delivery-date JS-delivery-date-${itemKey}">Delivery date: ${deliveryDateText}</p>
        <div class="item-content">
          <div class="product">
            <img src="${product.image}">
            <div class="info">
              <h4>${product.name}</h4>
              <div class="price">$${formatCurrency(product.price)}</div>
              <div class="current-selection">
                <span>Quantity: ${quantity}</span><br>
                <span>Size: ${selectedSize}</span><br>
                <span>Color: ${selectedColor}</span><br>
              </div>
              <div class="action-row">
                <span class="item-buttons JS-update-button" data-index="${index}">Update</span>
                <span class="item-buttons JS-delete-button" data-index="${index}">Delete</span>
              </div>
              <div class="item-edit JS-item-edit-${index}" style="display:none;">
                <div class="options">
                  <div class="option-field">
                    <strong>Quantity</strong>
                    ${buildQuantitySelect(index, quantity)}
                  </div>
                  ${buildSizeOptionsHTML(index, sizes, selectedSize)}
                  ${buildColorOptionsHTML(index, colors, selectedColor)}
                </div>
                <div class="edit-actions">
                  <button class="item-buttons JS-save-button" data-index="${index}">Save</button>
                  <button class="item-buttons JS-cancel-button" data-index="${index}">Cancel</button>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="box delivery">
              <h5 class="delivery-option">Choose a Delivery Option:</h5>
              ${shippingOptions.map((option) => buildDeliveryOptionHTML(itemKey, option, option.label === selectedShippingOption.label, index)).join('')}
            </div>
          </div>
        </div>
      </div>`;
  }).join('');

  updateOrderSummary();
}//done

function getEditValues(index) {
  const itemContainer = document.querySelector(`.JS-cart-item-container[data-cart-index="${index}"]`);
  if (!itemContainer) return null;

  const quantitySelect = itemContainer.querySelector('.JS-edit-quantity');
  const sizeInput = itemContainer.querySelector(`input[name="size-${index}"]:checked`);
  const colorInput = itemContainer.querySelector(`input[name="color-${index}"]:checked`);

  return {
    quantity: quantitySelect ? Number(quantitySelect.value) : cart[index].quantity,
    size: sizeInput ? sizeInput.value : cart[index].size,
    color: colorInput ? colorInput.value : cart[index].color
  };
}//done

function toggleEditPanel(index, show) {
  const itemContainer = document.querySelector(`.JS-cart-item-container[data-cart-index="${index}"]`);
  if (!itemContainer) return;
  const editPanel = itemContainer.querySelector(`.JS-item-edit-${index}`);
  const updateButton = itemContainer.querySelector(`.JS-update-button[data-index="${index}"]`);

  if (editPanel) {
    editPanel.style.display = show ? 'block' : 'none';
  }
  if (updateButton) {
    updateButton.style.display = show ? 'none' : 'inline-block';
  }
}//done

function initCheckout() {
  renderCart();

  const placeOrderButton = document.querySelector('.JS-place-order');
  if (placeOrderButton) {
    placeOrderButton.addEventListener('click', () => {
      if (!cart.length) {
        alert('Your cart is empty. Add some items before placing an order.');
        return;
      }

      const itemsPrice = calculateItemsPrice();
      const shipping = calculateShipping();
      const totalBeforeTax = itemsPrice + shipping;
      const tax = calculateTax(totalBeforeTax);
      const orderTotal = calculateOrderTotal(totalBeforeTax);

      const placedOrder = placeOrder({
        cartItems: cart.map((item) => ({ ...item })),
        shippingCost: shipping,
        subtotal: totalBeforeTax,
        tax,
        totalAmount: orderTotal
      });

      if (placedOrder) {
        window.location.href = 'orders.html';
      }
    });
  }

  const orderSummary = document.querySelector('.JS-order-summary');
  if (!orderSummary) return;

  orderSummary.addEventListener('click', (event) => {
    const updateButton = event.target.closest('.JS-update-button');
    const saveButton = event.target.closest('.JS-save-button');
    const cancelButton = event.target.closest('.JS-cancel-button');
    const deleteButton = event.target.closest('.JS-delete-button');

    if (updateButton) {
      const index = Number(updateButton.dataset.index);
      toggleEditPanel(index, true);
      return;
    }

    if (cancelButton) {
      const index = Number(cancelButton.dataset.index);
      toggleEditPanel(index, false);
      return;
    }

    if (saveButton) {
      const index = Number(saveButton.dataset.index);
      const values = getEditValues(index);
      if (!values) return;

      updateCartItem(index, {
        quantity: values.quantity,
        size: values.size,
        color: values.color
      });
      renderCart();
      return;
    }

    if (deleteButton) {
      const index = Number(deleteButton.dataset.index);
      removeFromCart(index);
      renderCart();
      return;
    }
  });

  orderSummary.addEventListener('change', (event) => {
    const deliveryOption = event.target.closest('.JS-delivery-option');
    if (!deliveryOption) return;

    const cartIndex = Number(deliveryOption.dataset.cartIndex);
    const selectedOptionLabel = deliveryOption.value;
    setDeliveryOption(cartIndex, selectedOptionLabel);

    const itemKey = deliveryOption.dataset.itemKey;
    const deliveryDateElement = document.querySelector(`.JS-delivery-date-${itemKey}`);
    if (!deliveryDateElement) return;

    const days = Number(deliveryOption.dataset.deliveryDays);
    deliveryDateElement.textContent = `Delivery date: ${getDeliveryDateText(days)}`;
    updateOrderSummary();
  });
}//done

initCheckout();

