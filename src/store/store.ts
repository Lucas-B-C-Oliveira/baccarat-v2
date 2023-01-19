import { configureStore } from '@reduxjs/toolkit'
import beadPlateSlice from '../slices/beadPlateSlice'
import bigRoadSlice from '../slices/bigRoadSlice'
import bigEyeBoySlice from '../slices/bigEyeBoySlice';
import smallRoadSlice from '../slices/smallRoadSlice'
import cockroachPigSlice from '../slices/cockroachPigSlice';

export const store = configureStore({
  reducer: {
    beadPlate: beadPlateSlice,
    bigRoad: bigRoadSlice,
    bigEyeBoy: bigEyeBoySlice,
    smallRoad: smallRoadSlice,
    cockroachPig: cockroachPigSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch