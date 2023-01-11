import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store/store'
import { BallBigRoad, BigRoadState, BarOfBallOfTheBigRoad } from '../utils/globalTypesEnumsAndInterfaces'


const initialState: BigRoadState = {
  bigRoadBalls: []
}

export const bigRoadSlice = createSlice({
  name: 'bigRoad',
  initialState,
  reducers: {
    addBallsOnBigRoad: (state, action: PayloadAction<BallBigRoad>) => {
      const newState = [...state.bigRoadBalls, action.payload]
      state.bigRoadBalls = newState
    },
    addBarOnLastBallOfTheBigRoad: (state, action: PayloadAction<BarOfBallOfTheBigRoad>) => {

      const lastBall = state.bigRoadBalls.pop()

      if (lastBall) {
        lastBall.bars = [...lastBall.bars, action.payload]
        const newState = [...state.bigRoadBalls, lastBall]
        state.bigRoadBalls = newState
      }
    },
    setBallOnBigRoad: (state, action: PayloadAction<BallBigRoad>) => {
      state.bigRoadBalls = [action.payload]
    },
    cleanTheBigRoad: (state) => {
      state.bigRoadBalls = []
    },
  },
})

export const { addBallsOnBigRoad, setBallOnBigRoad, cleanTheBigRoad, addBarOnLastBallOfTheBigRoad } = bigRoadSlice.actions

/// This is a Example of Selector 
export const getBigRoadBalls = (state: RootState) => state.bigRoad.bigRoadBalls

export default bigRoadSlice.reducer