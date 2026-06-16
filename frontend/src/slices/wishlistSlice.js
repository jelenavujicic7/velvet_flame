import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
  },
  reducers: {
    loadWishlist: (state, action) => {
      state.wishlistItems = action.payload || [];
    },
    addWishlistItem: (state, action) => {
      const exists = state.wishlistItems.find(
        (item) => item._id === action.payload._id
      );

      if (!exists) {
        state.wishlistItems = [...state.wishlistItems, action.payload];
      }
    },
    removeWishlistItem: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item._id !== action.payload
      );
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
    },
  },
});

export const {
  loadWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
