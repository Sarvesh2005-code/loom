import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define types broadly for now based on transcript usage
interface Shape {
    id: string;
    type: string; // "frame", "rectangle", "ellipse", "text", "image"
    x: number;
    y: number;
    width: number;
    height: number;
    fill?: string;
    stroke?: string;
    rotation?: number;
    // ... other properties
}

interface ShapesState {
    shapes: Record<string, Shape>; // Entity State
    ids: string[];
    tool: "select" | "hand" | "rectangle" | "ellipse" | "text" | "image" | "pencil"; // Current tool
    selected: Record<string, boolean>; // Selected shapes
    viewport: {
        x: number;
        y: number;
        zoom: number;
    };
}

const initialState: ShapesState = {
    shapes: {},
    ids: [],
    tool: "select",
    selected: {},
    viewport: { x: 0, y: 0, zoom: 1 },
}

export const shapesSlice = createSlice({
    name: 'shapes',
    initialState,
    reducers: {
        setTool: (state, action: PayloadAction<ShapesState['tool']>) => {
            state.tool = action.payload;
        },
        setViewport: (state, action: PayloadAction<ShapesState['viewport']>) => {
            state.viewport = action.payload;
        },
        // Add other reducers as needed for shape manipulation
        addShape: (state, action: PayloadAction<Shape>) => {
            state.shapes[action.payload.id] = action.payload;
            state.ids.push(action.payload.id);
        },
        // ...
    },
})

export const { setTool, setViewport, addShape } = shapesSlice.actions

export default shapesSlice.reducer
