import { useCanvas } from "./editorProvider";

export default function DrawingImgCanvas({ className }: { className: string }) {

    const {
        internal: { onMouseDown, onMouseMove, onMouseUp, canvasRef },
    } = useCanvas();

    return (
        <canvas
            className={className}
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            style={{ border: '1px solid black' }}
        />
    );
}