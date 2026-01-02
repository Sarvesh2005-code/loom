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
    // Undo/Redo History
    past: Array<{ shapes: Record<string, Shape>; ids: string[] }>;
    future: Array<{ shapes: Record<string, Shape>; ids: string[] }>;
}

const initialState: ShapesState = {
    shapes: {},
    ids: [],
    tool: "select",
    selectedIds: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    past: [],
    future: [],
}

// Helper to push state to history before changing it
const pushHistory = (state: ShapesState) => {
    // Limit history stack size if needed (e.g., 50)
    state.past.push({ shapes: state.shapes, ids: state.ids });
    state.future = []; // Clear future on new action
};

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
            pushHistory(state);
            state.shapes[action.payload.id] = action.payload;
            state.ids.push(action.payload.id);
            state.selectedIds = [action.payload.id];
        },
        updateShape: (state, action: PayloadAction<Partial<Shape> & { id: string }>) => {
            const { id, ...changes } = action.payload;
            if (state.shapes[id]) {
                const currentShape = state.shapes[id];
                // Only push history if there's an actual change (optimization)
                // For simplicity, we push on every update call for now, but dragging might spam this.
                // Ideally, pushHistory should be called on dragStart/end, but for this simplified Redux:
                // We'll trust the caller (CanvasBoard) to only dispatch updateShape on drag end or throttling.
                // For now, let's assume updateShape is "committed" change.
                pushHistory(state);
                state.shapes[id] = { ...currentShape, ...changes };
            }
        },
        selectShape: (state, action: PayloadAction<string>) => {
            state.selectedIds = [action.payload];
        },
        deselectAll: (state) => {
            state.selectedIds = [];
        },
        setShapes: (state, action: PayloadAction<Record<string, Shape>>) => {
            pushHistory(state);
            state.shapes = action.payload;
            state.ids = Object.keys(action.payload);
        },
        undo: (state) => {
            if (state.past.length > 0) {
                const previous = state.past.pop()!;
                state.future.push({ shapes: state.shapes, ids: state.ids });
                state.shapes = previous.shapes;
                state.ids = previous.ids;
                state.selectedIds = []; // Clear selection on undo to avoid ghost selection
            }
        },
        redo: (state) => {
            if (state.future.length > 0) {
                const next = state.future.pop()!;
                state.past.push({ shapes: state.shapes, ids: state.ids });
                state.shapes = next.shapes;
                state.ids = next.ids;
                state.selectedIds = [];
            }
        },
        deleteShape: (state, action: PayloadAction<string>) => {
            pushHistory(state);
            const idToDelete = action.payload;
            delete state.shapes[idToDelete];
            state.ids = state.ids.filter(id => id !== idToDelete);
            state.selectedIds = state.selectedIds.filter(id => id !== idToDelete);
        }
    },
})

export const { setTool, setViewport, addShape, updateShape, selectShape, deselectAll, setShapes, undo, redo, deleteShape } = shapesSlice.actions

// Duplicate removed

export default shapesSlice.reducer
