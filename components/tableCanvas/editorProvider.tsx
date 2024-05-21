import React, { useRef, useEffect, useState, useContext, createContext } from 'react';
import { Path, Point, Tool, defaultLayers, Layer, Img } from './canvasTypes';
import { getSvgPoint, isSelected, removeLayer, setPosMoving, setStartMoving } from './canvasFunctions';


interface CanvasProviderProps {
    internal: {
        onMouseDown: (e: React.MouseEvent<any>) => void;
        onMouseMove: (e: React.MouseEvent<any>) => void;
        onMouseUp: () => void;
        paths: Path[];
        getPathD: (points: Point[]) => string;
        currentPath: Point[];
        selection: [Point, Point] | null;
        selectedBlock: { paths?: number[], images?: number[] } | null;
        removeLastPath: () => void;
        setPaths: React.Dispatch<React.SetStateAction<Path[]>>;
        canvasRef: React.RefObject<HTMLCanvasElement>;
    };
    external: {
        currentColor: string;
        setCurrentTool: React.Dispatch<React.SetStateAction<Tool>>;
        currentTool: Tool;
        setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
        activeLayer: number;
        setActiveLayer: React.Dispatch<React.SetStateAction<number>>;
        layers: Layer;
        addImage: (src: string, width: number, height: number, x: number, y: number) => void;
        setLayers: React.Dispatch<React.SetStateAction<Layer>>;
    };
}


const canvasProviderContext = createContext<CanvasProviderProps | undefined>(undefined);

export const useCanvas = () => {
    const context = useContext(canvasProviderContext);
    if (!context) {
        throw new Error('useCanvas must be used within a CanvasProvider');
    }
    return context;
};


export default function CanvasProvider({ children, className }: { children?: React.ReactNode, className?: string }) {
    const [currentTool, setCurrentTool] = useState<Tool>(Tool.Pen);
    const [currentColor, setCurrentColor] = useState<string>('#000000');
    const [activeLayer, setActiveLayer] = useState<number>(0);
    const [layers, setLayers] = useState<Layer>(defaultLayers);
    const [selection, setSelection] = useState<[Point, Point] | null>(null);
    const [selectedBlock, setSelectedBlock] = useState<{ paths?: number[], images?: number[] } | null>(null);
    const [images, setImages] = useState<Img[]>([]);
    const [paths, setPaths] = useState<Path[]>([]);
    const [currentPath, setCurrentPath] = useState<Point[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const [relativePosition, setRelativePosition] = useState<Point>({ x: 0, y: 0 });
    const image = useRef<HTMLImageElement>(new Image()).current;

    useEffect(() => {
        image.src = '/static/image/shield.png'; // Reemplaza con la URL de tu imagen
        image.onload = () => {
            setImages([
                ...images,
                {
                    id: Date.now(),
                    name: image.src,
                    src: image.src,
                    width: image.width,
                    height: image.height,
                    position: { x: 100, y: 100 },
                    image
                },
            ]);
            drawImage();
        };
    }, [image]);

    useEffect(() => {
        drawImage();
    }, [images]);

    const onMouseDown = (e: React.MouseEvent<any>) => {
        if (currentTool === Tool.Pen) {
            setCurrentPath([...currentPath, getSvgPoint(e)]);
            setIsDrawing(true);
        }
        else if (currentTool === Tool.Selector) {
            const point = getSvgPoint(e);
            setSelection([point, getSvgPoint(e)]);
        }
        else if (currentTool === Tool.Move) {
            const canvas = canvasRef.current;
            if (!canvas) return;
            setStartMoving(e, canvas, images, setIsDragging, setRelativePosition);
            console.log('isDragging', isDragging);
        }
    };

    const onMouseMove = (e: React.MouseEvent<any>) => {
        if (currentTool === Tool.Pen) {
            if (!isDrawing) return;
            setCurrentPath([...currentPath, getSvgPoint(e)]);
            setSelectedBlock(null);
        }
        else if (currentTool === Tool.Selector) {
            if (selection === null) return;
            setSelection([selection[0], getSvgPoint(e)]);
        }
        else if (currentTool === Tool.Move) {
            if (isDragging === null) return;
            const canvas = canvasRef.current;
            if (canvas) setImages(setPosMoving(e, canvas, images, isDragging, relativePosition));
        }
    }

    const onMouseUp = () => {
        if (currentTool === Tool.Pen) {
            if (currentPath.length > 0) {
                const newPath: Path = { id: Date.now(), points: currentPath, color: currentColor, layer: activeLayer };
                setPaths([...paths, newPath]);
                setCurrentPath([]);
            }
            setIsDrawing(false);
        }
        else if (currentTool === Tool.Selector) {
            if (selection) {
                let pathsSelected: number[] = [];
                paths.forEach((path, index) => {
                    if (isSelected(selection, path, activeLayer)) pathsSelected.push(path.id);
                });
                setSelectedBlock({ paths: pathsSelected });
                console.log('pathsSelected', pathsSelected);
            }

            setSelection(null);
        }
        else if (currentTool === Tool.Move) {
            setIsDragging(null);
        }
    }


    const removeLastPath = () => setPaths(paths.slice(0, -1));
    const removeCanvasLayer = (layer: number) => removeLayer(layers, layer, setPaths, setLayers, activeLayer, setActiveLayer, paths)

    const getPathD = (points: Point[]): string => {
        if (points.length < 3) {
            return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
        }
        let d = `M ${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length - 2; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            d += ` Q ${points[i].x},${points[i].y} ${xc},${yc}`;
        }
        d += ` Q ${points[points.length - 2].x},${points[points.length - 2].y} ${points[points.length - 1].x},${points[points.length - 1].y}`;
        return d;
    };

    const drawImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                images.forEach((img) => {
                    ctx.drawImage(img.image, img.position.x, img.position.y);
                });
            }
        }
    };

    const addImage = (src: string, width: number, height: number, x: number, y: number) => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            setImages([
                ...images,
                {
                    id: Date.now(),
                    name: src,
                    src: src,
                    width: width,
                    height: height,
                    position: { x, y },
                    image
                },
            ]);
            drawImage();
        };
    }

    return (
        <canvasProviderContext.Provider value={{
            internal: { onMouseDown, onMouseUp, onMouseMove, paths, getPathD, currentPath, selection, selectedBlock, removeLastPath, setPaths,  canvasRef },
            external: { currentColor, setCurrentTool, setCurrentColor, activeLayer, setActiveLayer, layers, addImage, setLayers, currentTool }
        }}>
            {children}
        </canvasProviderContext.Provider>
    );
}
