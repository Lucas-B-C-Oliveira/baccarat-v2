import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store/store'
import { BallBeadPlate, BeadPlateState } from '../utils/globalTypesEnumsAndInterfaces'


const initialState: BeadPlateState = {
  beadPlateBalls: []
}

export const beadPlateSlice = createSlice({
  name: 'beadPlate',
  initialState,
  reducers: {
    addBallsOnBeadPlate: (state, action: PayloadAction<BallBeadPlate>) => {
      const newState = [...state.beadPlateBalls, action.payload]
      state.beadPlateBalls = newState
      // state.beadPlateBalls.push(action.payload)
    },
    setBallOnBeadPlate: (state, action: PayloadAction<BallBeadPlate>) => {
      state.beadPlateBalls = [action.payload]
    },
    cleanTheBeadPlate: (state) => {
      state.beadPlateBalls = []
    },
  },
})

export const { addBallsOnBeadPlate, setBallOnBeadPlate, cleanTheBeadPlate } = beadPlateSlice.actions

/// This is a Example of Selector 
export const getBeadPlateBalls = (state: RootState) => state.beadPlate.beadPlateBalls

export default beadPlateSlice.reducer