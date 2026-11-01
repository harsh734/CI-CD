import axiosInstance from './axiosInstance';

export const userApi = {
  updateOnboarding: (completed) =>
    axiosInstance.patch('/users/me/onboarding', { completed }),
};
