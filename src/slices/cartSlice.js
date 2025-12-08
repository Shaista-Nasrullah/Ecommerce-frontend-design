// src/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log("addToCart reducer called!");
      console.log("Action payload:", action.payload);

      const {
        id, // This is product.id from ProductDetail.js, kept for existing logic
        product_id, // New: from action.payload
        variation_id, // New: from action.payload
        name,
        // The payload now sends 'unit_price' and 'unitPrice'.
        // We'll use 'unit_price' from the payload as the core price for cart items.
        unit_price, // New: from action.payload (this is the per-unit base price)
        image,
        category,
        quantity: addedQuantity = 1, // 'quantity' from payload, renamed to avoid conflict
        item_tax, // New: from action.payload
        tax_id, // New: from action.payload
        unit_price_inc_tax, // New: from action.payload
        discount_amount, // New: from action.payload
        totalPrice: payloadTotalPrice, // New: totalPrice from payload, renamed to avoid conflict with calculated totalPrice
      } = action.payload;

      const existingItem = state.items.find((item) => item.id === id); // Find by product.id

      // Use the unit_price from the payload for all calculations
      const itemUnitPrice = parseFloat(unit_price) || 0;
      const itemTaxAmount = parseFloat(item_tax) || 0;
      const itemDiscountAmount = parseFloat(discount_amount) || 0;
      const itemUnitPriceIncTax = parseFloat(unit_price_inc_tax) || 0;

      console.log("Unit Price derived:", itemUnitPrice);

      if (existingItem) {
        existingItem.quantity += addedQuantity;
        // Recalculate total for this item based on its unit price and new quantity
        existingItem.totalPrice = existingItem.quantity * itemUnitPrice;
        // Update other fields as well if they could change (though usually these are static per product variation)
        existingItem.item_tax = itemTaxAmount * existingItem.quantity; // Scale tax by quantity
        existingItem.discount_amount =
          itemDiscountAmount * existingItem.quantity; // Scale discount by quantity
        existingItem.unit_price_inc_tax = itemUnitPriceIncTax;

        console.log("Existing item updated:", existingItem);
      } else {
        state.items.push({
          id: id, // Keep for existing logic in other reducers
          product_id: product_id, // Store new field
          variation_id: variation_id, // Store new field
          name: name,
          price: itemUnitPrice, // Store as 'price' for consistency in other reducers (e.g., removeFromCart)
          unitPrice: itemUnitPrice, // Store new field explicitly
          quantity: addedQuantity,
          image: image,
          category: category,
          item_tax: itemTaxAmount * addedQuantity, // Store tax scaled by quantity
          tax_id: tax_id, // Store new field
          unit_price_inc_tax: itemUnitPriceIncTax, // Store new field
          discount_amount: itemDiscountAmount * addedQuantity, // Store discount scaled by quantity
          totalPrice: itemUnitPrice * addedQuantity, // Calculate total price for new item
          // If payloadTotalPrice is strictly for the initial addedQuantity, use it
          // totalPrice: parseFloat(payloadTotalPrice),
        });
        console.log("New item added:", state.items[state.items.length - 1]);
      }

      // Recalculate totalQuantity and totalAmount for the entire cart
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      // Ensure totalAmount considers the correct `totalPrice` on each item
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      console.log(
        "Cart state after addToCart:",
        state.items,
        state.totalQuantity,
        state.totalAmount
      );
    },
    removeFromCart: (state, action) => {
      const idToRemove = action.payload;
      const existingItem = state.items.find((item) => item.id === idToRemove);

      if (existingItem) {
        // Decrement quantity by one
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== idToRemove);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price; // Subtract unit price
          existingItem.item_tax -=
            existingItem.item_tax / (existingItem.quantity + 1); // Adjust total tax
          existingItem.discount_amount -=
            existingItem.discount_amount / (existingItem.quantity + 1); // Adjust total discount
        }

        // Recalculate totalQuantity and totalAmount for the entire cart
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.totalAmount = state.items.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
      }
    },
    incrementItemQuantity: (state, action) => {
      // New action to increment quantity from MyCart
      const idToIncrement = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === idToIncrement
      );
      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += existingItem.price;
        // Re-adjust item_tax and discount_amount based on the unit values if available
        // Assuming item.price is the unit_price here
        if (existingItem.unitPrice) {
          // Use unitPrice if stored explicitly
          existingItem.item_tax +=
            existingItem.item_tax / (existingItem.quantity - 1); // Add unit tax
          existingItem.discount_amount +=
            existingItem.discount_amount / (existingItem.quantity - 1); // Add unit discount
        }
        state.totalQuantity++;
        state.totalAmount += existingItem.price;
      }
    },
    decrementItemQuantity: (state, action) => {
      // New action to decrement quantity from MyCart
      const idToDecrement = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === idToDecrement
      );
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== idToDecrement);
          state.totalQuantity--; // Decrement before potentially removing item
          state.totalAmount -= existingItem.price; // Subtract before potentially removing item
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
          if (existingItem.unitPrice) {
            // Use unitPrice if stored explicitly
            existingItem.item_tax -=
              existingItem.item_tax / (existingItem.quantity + 1); // Subtract unit tax
            existingItem.discount_amount -=
              existingItem.discount_amount / (existingItem.quantity + 1); // Subtract unit discount
          }
          state.totalQuantity--;
          state.totalAmount -= existingItem.price;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementItemQuantity,
  decrementItemQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
