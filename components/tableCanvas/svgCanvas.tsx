import { useCanvas } from "./editorProvider";

export default function DrawingSvgCanvas({ className }: { className: string }) {

    const {
        internal: { onMouseDown, onMouseMove, onMouseUp, paths, getPathD, currentPath, selection, selectedBlock },
        external: { currentColor }
    } = useCanvas();

    return (
        <svg
            width={800}
            height={600}
            className={className}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            {paths.map((path, index) => {
                return (
                    <>
                        {
                            selectedBlock?.paths?.includes(path.id) ?
                                <path
                                    key={path.id + "index"}
                                    d={getPathD(path.points)}
                                    stroke={"#6cb6f2"}
                                    fill="none"
                                    strokeWidth={4}
                                />
                                : null
                        }
                        <path
                            key={path.id}
                            d={getPathD(path.points)}
                            stroke={path.color}
                            fill="none"
                            strokeWidth={1}
                        />
                    </>
                )

            }
            )}
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