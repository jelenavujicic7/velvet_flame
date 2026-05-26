import { createSlice } from '@reduxjs/toolkit';

const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    localStorage.removeItem('userInfo');
    return null;
  }
};

const initialState = {
  userInfo: getUserInfo(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      const userKey = state.userInfo?._id || state.userInfo?.email || state.userInfo?.name;

      if (userKey) {
        sessionStorage.removeItem(`wishlist-${userKey}`);
      }

      state.userInfo = null;
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('orders');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
