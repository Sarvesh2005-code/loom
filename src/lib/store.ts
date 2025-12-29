import { configureStore } from '@reduxjs/toolkit'
import shapesReducer from './slices/shapesSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            shapes: shapesReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
