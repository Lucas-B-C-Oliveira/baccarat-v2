import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store/store'
import { CockroachPigBall, CockroachPigState } from '../utils/globalTypesEnumsAndInterfaces'

const initialState: CockroachPigState = {
  cockroachPigBalls: []
}

export const cockroachPigSlice = createSlice({
  name: 'cockroachPigSlice',
  initialState,
  reducers: {
    addBallsOnCockroachPig: (state, action: PayloadAction<CockroachPigBall>) => {
      const newState = [...state.cockroachPigBalls, action.payload]
      state.cockroachPigBalls = newState
    },
    setBallOnCockroachPig: (state, action: PayloadAction<CockroachPigBall>) => {
      state.cockroachPigBalls = [action.payload]
    },
    cleanTheCockroachPig: (state) => {
      state.cockroachPigBalls = []
    },
  },
})

export const { addBallsOnCockroachPig, setBallOnCockroachPig, cleanTheCockroachPig } = cockroachPigSlice.actions

/// This is a Example of Selector 
export const getCockroachPigBalls = (state: RootState) => state.cockroachPig.cockroachPigBalls

export default cockroachPigSlice.reducer