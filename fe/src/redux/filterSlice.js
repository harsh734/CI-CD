import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    status: 'all',       // 'all' | 'active' | 'completed'
    category: 'all',     // 'all' | 'work' | 'personal' | ...
    priority: 'all',     // 'all' | 'high' | 'medium' | 'low'
    searchQuery: '',
  },
  reducers: {
    setStatusFilter(state, action)   { state.status = action.payload; },
    setCategoryFilter(state, action) { state.category = action.payload; },
    setPriorityFilter(state, action) { state.priority = action.payload; },
    setSearchQuery(state, action)    { state.searchQuery = action.payload; },
    resetFilters(state) {
      state.status = 'all';
      state.category = 'all';
      state.priority = 'all';
      state.searchQuery = '';
    },
  },
});

export const {
  setStatusFilter, setCategoryFilter, setPriorityFilter,
  setSearchQuery, resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
