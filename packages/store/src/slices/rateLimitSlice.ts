import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RateLimitInfo, RateLimitResource } from '@repo-radar/core';

export type RateLimitState = Partial<Record<RateLimitResource, RateLimitInfo>>;

const initialState: RateLimitState = {};

const isExhausted = (info: RateLimitInfo | undefined) =>
  info !== undefined && info.remaining === 0 && info.resetAt > Date.now();

export const rateLimitSlice = createSlice({
  name: 'rateLimit',
  initialState,
  reducers: {
    rateLimitReceived(state, action: PayloadAction<RateLimitInfo>) {
      state[action.payload.resource] = action.payload;
    },
    rateLimitCleared() {
      return initialState;
    },
  },
  selectors: {
    selectCoreRateLimit: (state) => state.core ?? null,
    selectSearchRateLimit: (state) => state.search ?? null,
    selectIsCoreRateLimited: (state) => isExhausted(state.core),
    selectIsSearchRateLimited: (state) => isExhausted(state.search),
  },
});

export const { rateLimitReceived, rateLimitCleared } = rateLimitSlice.actions;
export const {
  selectCoreRateLimit,
  selectSearchRateLimit,
  selectIsCoreRateLimited,
  selectIsSearchRateLimited,
} = rateLimitSlice.selectors;
