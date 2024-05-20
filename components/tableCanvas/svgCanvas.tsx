import { Point, Path } from "./editor";

export default function DrawingSvgCanvas(
    { className, paths, currentPath, currentColor, startDrawing, draw, stopDrawing, getPathD, selection }
        : {
            className: string,
            paths: Path[],
            currentPath: Point[],
            currentColor: string,
            startDrawing: (e: React.MouseEvent<SVGSVGElement>) => void,
            draw: (e: React.MouseEvent<SVGSVGElement>) => void,
            stopDrawing: () => void,
            getPathD: (points: Point[]) => string,
            selection: Point[] | null
        }) {

    return (
        <svg
            width={800}
            height={600}
            className={className}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
        >
            {paths.map(path => (
                <path
                    key={path.id}
                    d={getPathD(path.points)}
                    stroke={path.color}
                    fill="none"
                    strokeWidth={path.selected ? 2 : 1}
                />
            ))}
            {currentPath.length > 0 && (
                <path
                    d={getPathD(currentPath)}
                    stroke={currentColor}
                    fill="none"
                />
            )}
            {
                selection && (
                    <rect
                        x={Math.min(selection[0].x, selection[1].x)}
                        y={Math.min(selection[0].y, selection[1].y)}
                        width={Math.abs(selection[0].x - selection[1].x)}
                        height={Math.abs(selection[0].y - selection[1].y)}
                        fill="none"
                        stroke="black"
                    />
                )
            }
        </svg>
    )
}