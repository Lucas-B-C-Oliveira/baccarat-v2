import { configureStore } from '@reduxjs/toolkit'
import beadPlateSlice from '../slices/beadPlateSlice'
import bigRoadSlice from '../slices/bigRoadSlice'

export const store = configureStore({
  reducer: {
    beadPlate: beadPlateSlice,
    bigRoad: bigRoadSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch