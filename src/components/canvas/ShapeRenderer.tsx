import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Shape } from "@/lib/slices/shapesSlice";
import { memo } from "react";

interface ShapeRendererProps {
    shape: Shape;
    isSelected: boolean;
}

function ShapeRenderer({ shape, isSelected }: ShapeRendererProps) {
    const commonProps = {
        transform: `translate(${shape.x}, ${shape.y}) rotate(${shape.rotation})`,
        fill: shape.fill,
        stroke: isSelected ? "#3b82f6" : shape.stroke, // Blue highlight if selected, else shape color
        strokeWidth: isSelected ? 2 : shape.strokeWidth,
        vectorEffect: "non-scaling-stroke", // Keeps stroke width constant on zoom if we were scaling SVG, but we handle zoom on parent. safe to keep.
        className: "transition-colors duration-200"
    };

    // React.memo optimization: This component only re-renders if shape props change.

    switch (shape.type) {
        case "rectangle":
            return (
                <rect
                    width={Math.max(0, shape.width)}
                    height={Math.max(0, shape.height)}
                    rx={shape.type === "rectangle" ? 8 : 0} // Slight rounded corners for modern look
                    {...commonProps}
                />
            );
        case "ellipse":
            return (
                <ellipse
                    cx={shape.width / 2}
                    cy={shape.height / 2}
                    rx={Math.max(0, shape.width) / 2}
                    ry={Math.max(0, shape.height) / 2}
                    {...commonProps}
                />
            );
        case "text":
            return (
                <text
                    x={shape.x}
                    y={shape.y}
                    transform={`rotate(${shape.rotation}, ${shape.x}, ${shape.y})`}
                    dy="1em"
                    fontSize={16}
                    fontFamily="Inter, sans-serif"
                    fill={shape.fill || "black"}
                    stroke="none"
                    className="select-none pointer-events-none font-medium"
                >
                    {shape.content || "Double click to edit"}
                </text>
            );
        default:
            return null;
    }
}

export default memo(ShapeRenderer);
