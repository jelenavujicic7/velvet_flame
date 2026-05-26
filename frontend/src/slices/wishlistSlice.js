import { createSlice } from '@reduxjs/toolkit';

const getWishlistKey = (userKey) => `wishlist-${userKey}`;

const readWishlist = (userKey) => {
  if (!userKey) {
    return [];
  }

  try {
    const wishlist = sessionStorage.getItem(getWishlistKey(userKey));
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    sessionStorage.removeItem(getWishlistKey(userKey));
    return [];
  }
};

const saveWishlist = (userKey, items) => {
  if (userKey) {
    sessionStorage.setItem(getWishlistKey(userKey), JSON.stringify(items));
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
  },
  reducers: {
    loadWishlist: (state, action) => {
      state.wishlistItems = readWishlist(action.payload);
    },
    toggleWishlistItem: (state, action) => {
      const { product, userKey } = action.payload;
      const exists = state.wishlistItems.find((item) => item._id === product._id);
      const nextItems = exists
        ? state.wishlistItems.filter((item) => item._id !== product._id)
        : [...state.wishlistItems, product];

      state.wishlistItems = nextItems;

      saveWishlist(userKey, nextItems);
    },
    removeWishlistItem: (state, action) => {
      const { productId, userKey } = action.payload;
      const nextItems = state.wishlistItems.filter(
        (item) => item._id !== productId
      );

      state.wishlistItems = nextItems;

      saveWishlist(userKey, nextItems);
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
    },
  },
});

export const {
  loadWishlist,
  toggleWishlistItem,
  removeWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
