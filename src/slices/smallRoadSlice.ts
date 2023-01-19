import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store/store'
import { SmallRoadBall, SmallRoadState } from '../utils/globalTypesEnumsAndInterfaces'


const initialState: SmallRoadState = {
  smallRoadBalls: []
}

export const smallRoadSlice = createSlice({
  name: 'smallRoadSlice',
  initialState,
  reducers: {
    addBallsOnSmallRoad: (state, action: PayloadAction<SmallRoadBall>) => {
      const newState = [...state.smallRoadBalls, action.payload]
      state.smallRoadBalls = newState
    },
    setBallOnSmallRoad: (state, action: PayloadAction<SmallRoadBall>) => {
      state.smallRoadBalls = [action.payload]
    },
    cleanTheSmallRoad: (state) => {
      state.smallRoadBalls = []
    },
  },
})

export const { addBallsOnSmallRoad, setBallOnSmallRoad, cleanTheSmallRoad } = smallRoadSlice.actions

/// This is a Example of Selector 
export const getSmallRoadBalls = (state: RootState) => state.smallRoad.smallRoadBalls

export default smallRoadSlice.reducer