import { createSlice } from '@reduxjs/toolkit';

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: { forceStart: false },
  reducers: {
    startTour(state) { state.forceStart = true; },
    tourFinished(state) { state.forceStart = false; },
  },
});

export const { startTour, tourFinished } = onboardingSlice.actions;
export default onboardingSlice.reducer;
