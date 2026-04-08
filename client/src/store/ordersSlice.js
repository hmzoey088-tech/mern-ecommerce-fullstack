import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  status: 'idle',
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    setOrderError(state, action) {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

export const { setOrders, setOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
