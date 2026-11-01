import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import filterReducer from './filterSlice';
import authReducer from './authSlice';
import onboardingReducer from './onboardingSlice';

const store = configureStore({
  reducer: {
    tasks:      tasksReducer,
    filter:     filterReducer,
    auth:       authReducer,
    onboarding: onboardingReducer,
  },
});

export default store;
