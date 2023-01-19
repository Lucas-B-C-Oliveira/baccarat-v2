import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store/store'
import { BigEyeBoyBall, BigEyeBoyState } from '../utils/globalTypesEnumsAndInterfaces'


const initialState: BigEyeBoyState = {
  bigEyeBoyBalls: []
}

export const bigEyeBoySlice = createSlice({
  name: 'bigEyeBoy',
  initialState,
  reducers: {
    addBallsOnBigEyeBoy: (state, action: PayloadAction<BigEyeBoyBall>) => {
      const newState = [...state.bigEyeBoyBalls, action.payload]
      state.bigEyeBoyBalls = newState
    },
    setBallOnBigEyeBoy: (state, action: PayloadAction<BigEyeBoyBall>) => {
      state.bigEyeBoyBalls = [action.payload]
    },
    cleanTheBigEyeBoy: (state) => {
      state.bigEyeBoyBalls = []
    },
  },
})

export const { addBallsOnBigEyeBoy, setBallOnBigEyeBoy, cleanTheBigEyeBoy } = bigEyeBoySlice.actions

/// This is a Example of Selector 
export const getBigEyeBoyBalls = (state: RootState) => state.bigEyeBoy.bigEyeBoyBalls

export default bigEyeBoySlice.reducer