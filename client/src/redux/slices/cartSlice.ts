import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DeliveryDetails {
  contactNo: string;
  address: string;
  city: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  deliveryDetails: DeliveryDetails;
}

const initialState: CartState = {
  items: [],
  deliveryDetails: {
    contactNo: "",
    address: "",
    city: "",
  },
};

// Define the Redux slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existingItem = state.items.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
      state.deliveryDetails = { contactNo: "", address: "", city: "" };
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
    },

    updateDeliveryDetails: (state, action: PayloadAction<DeliveryDetails>) => {
      state.deliveryDetails = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  updateDeliveryDetails,
} = cartSlice.actions;
export default cartSlice.reducer;
