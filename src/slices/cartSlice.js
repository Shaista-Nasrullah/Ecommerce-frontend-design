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
        id,
        name,
        price,
        image,
        quantity: addedQuantity = 1,
      } = action.payload; // Destructure payload, get addedQuantity
      const existingItem = state.items.find((item) => item.id === id);

      const unitPrice = parseFloat(price) || 0;
      console.log("Unit Price derived:", unitPrice);

      if (existingItem) {
        existingItem.quantity += addedQuantity; // Add the specified quantity
        existingItem.totalPrice = existingItem.quantity * unitPrice; // Recalculate total price for the item
        console.log("Existing item updated:", existingItem);
      } else {
        state.items.push({
          id: id,
          name: name,
          price: unitPrice,
          quantity: addedQuantity, // Use the specified quantity
          image: image,
          totalPrice: unitPrice * addedQuantity, // Calculate total price for new item
        });
        console.log("New item added:", state.items[state.items.length - 1]);
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
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
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
