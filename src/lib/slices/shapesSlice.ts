import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'; // We might need uuid or just standard Math.random for now

export interface Shape {
    id: string;
    type: "rectangle" | "ellipse" | "text" | "image";
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    rotation: number;
    content?: string;
}

export type ToolType = "select" | "hand" | "rectangle" | "ellipse" | "text" | "image" | "pencil";

interface ShapesState {
    shapes: Record<string, Shape>;
    ids: string[];
    tool: ToolType;
    selectedIds: string[];
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
    selectedIds: [],
    viewport: { x: 0, y: 0, zoom: 1 },
}

export const shapesSlice = createSlice({
    name: 'shapes',
    initialState,
    reducers: {
        setTool: (state, action: PayloadAction<ToolType>) => {
            state.tool = action.payload;
        },
        setViewport: (state, action: PayloadAction<ShapesState['viewport']>) => {
            state.viewport = action.payload;
        },
        addShape: (state, action: PayloadAction<Shape>) => {
            state.shapes[action.payload.id] = action.payload;
            state.ids.push(action.payload.id);
            // Automatically select new shape
            state.selectedIds = [action.payload.id];
        },
        updateShape: (state, action: PayloadAction<Partial<Shape> & { id: string }>) => {
            const { id, ...changes } = action.payload;
            if (state.shapes[id]) {
                state.shapes[id] = { ...state.shapes[id], ...changes };
            }
        },
        selectShape: (state, action: PayloadAction<string>) => {
            state.selectedIds = [action.payload];
        },
        deselectAll: (state) => {
            state.selectedIds = [];
        }
    },
})

export const { setTool, setViewport, addShape, updateShape, selectShape, deselectAll } = shapesSlice.actions

export default shapesSlice.reducer
