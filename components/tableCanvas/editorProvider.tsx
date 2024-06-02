import React, { useRef, useEffect, useState, useContext, createContext } from 'react';
import { Path, Point, Tool, defaultLayers, Layer, Img, BlockType } from './canvasTypes';
import { getSvgPoint, isImageSelected, isPathSelected, removeLayer, setPosMoving, setStartMoving } from './canvasFunctions';


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
        addImage: (src: string, width: number, height: number, x: number, y: number, layer?: number) => void;
        setLayers: React.Dispatch<React.SetStateAction<Layer>>;
        removeCanvasLayer: (layer: number) => void;
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
    const grid = 10;
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
    const [initialClick, setInitialClick] = useState<Point | null>(null);
    const [absoluteCoords, setAbsoluteCoords] = useState<Point>({ x: 0, y: 0 });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const [relativePosition, setRelativePosition] = useState<{ images: Point[], paths: Point[][] } | null>(null);



    const drawImage = (selectedImages?: number[]) => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                images.forEach(img => {
                    const px = img.position.x + absoluteCoords.x;
                    const py = img.position.y + absoluteCoords.y;
                    // set the image style
                    if (!selectedImages && selectedBlock?.images?.includes(img.id)) {
                        ctx.strokeStyle = 'blue';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(px, py, img.width, img.height);
                    }
                    else if (selectedImages && selectedImages.includes(img.id)) {
                        ctx.strokeStyle = 'blue';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(px, py, img.width, img.height);
                    }
                    ctx.drawImage(img.image, px, py, img.width, img.height);
                });
            }
        }
    }

    useEffect(() => {
        drawImage();
    }, [images, absoluteCoords]);

    useEffect(() => {
        // addImage('/static/image/bg.jpg', 800, 600, 0, 0, 0);
    }, []);

    const onMouseDown = (e: React.MouseEvent<any>) => {
        if (currentTool === Tool.Pen) {
            if(layers[activeLayer].type === BlockType.path || layers[activeLayer].type === BlockType.undefined){
                setCurrentPath([...currentPath, getSvgPoint(e)]);
                setIsDrawing(true);
            }
        }
        else if (currentTool === Tool.Selector) {
            const canvas = canvasRef.current;
            if (!canvas) return;
            if (setStartMoving(e, canvas, images, paths, setIsDragging, setRelativePosition, selectedBlock)) {
                if (selectedBlock && selectedBlock?.images!.length > 0 && selectedBlock?.paths!.length > 0)
                    setIsDragging(NaN);
                setSelection(null);
            }
            else {
                const point = getSvgPoint(e);
                setSelection([point, getSvgPoint(e)]);
                setSelectedBlock(null);
                drawImage([]);
            }
        }
        else if (currentTool === Tool.Move) {
            const canvas = canvasRef.current;
            if (!canvas) return;
            setInitialClick(getSvgPoint(e));
        }
    };

    const onMouseMove = (e: React.MouseEvent<any>) => {
        if (currentTool === Tool.Pen) {
            if (!isDrawing) return;
            setCurrentPath([...currentPath, getSvgPoint(e)]);
            setSelectedBlock(null);
        }
        else if (currentTool === Tool.Selector) {
            if (isDragging !== null) {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const [newimages, newpaths] = setPosMoving(e, canvas, images, paths, isDragging, relativePosition, selectedBlock)
                setImages(newimages);
                setPaths(newpaths);
            }
            else if (selection) {
                setSelection([selection[0], getSvgPoint(e)]);
                setSelectedBlock(null);
            }
        }
        else if (currentTool === Tool.Move) {
            if (initialClick) {
                const { x: dx, y: dy } = getSvgPoint(e);
                setAbsoluteCoords({ x: absoluteCoords.x + dx - initialClick.x, y: absoluteCoords.y + dy - initialClick.y });
                console.log(absoluteCoords);
                setInitialClick(getSvgPoint(e));
            }
        }
    }

    const onMouseUp = () => {
        if (currentTool === Tool.Pen) {
            if (currentPath.length > 0) {
                if (layers[activeLayer].type !== BlockType.undefined && layers[activeLayer].type !== BlockType.path)
                    return
                else if (layers[activeLayer].type === BlockType.undefined)
                    setLayers({ ...layers, [activeLayer]: { name: layers[activeLayer].name, type: BlockType.path } });;

                const newPath: Path = { id: Date.now(), points: currentPath, color: currentColor, layer: activeLayer };
                setPaths([...paths, newPath]);
                setCurrentPath([]);
            }
            setIsDrawing(false);
        }
        else if (currentTool === Tool.Selector) {
            if (isDragging !== null) {
                setIsDragging(null);
                setRelativePosition(null);
            }
            else if (selection) {
                const selectedPaths = paths.filter(path => isPathSelected(selection, path, activeLayer, absoluteCoords)).map(path => path.id);
                const selectedImages = images.filter(img => isImageSelected(selection, img, absoluteCoords)).map(img => img.id);
                if (selectedPaths.length > 0 || selectedImages.length > 0)
                    setSelectedBlock({
                        paths: selectedPaths,
                        images: selectedImages
                    });
                if (selectedImages.length > 0) drawImage(selectedImages);

            }
            setSelection(null);
        }
        else if (currentTool === Tool.Move) {
            setInitialClick(null);
        }
    }


    const removeLastPath = () => setPaths(paths.slice(0, -1));
    const removeCanvasLayer = (layer: number) => removeLayer(layers, layer, setPaths, setImages, setLayers, activeLayer, setActiveLayer, paths, images)

    const getPathD = (points: Point[]): string => {
        if (points.length < 3) {
            return `M ${points.map(p => `${p.x + absoluteCoords.x},${p.y + absoluteCoords.y}`).join(' L ')}`;
        }
        let d = `M ${points[0].x + absoluteCoords.x},${points[0].y + absoluteCoords.y}`;
        for (let i = 1; i < points.length - 2; i++) {
            // Use the average of the two points as the control point, add the absolute coords
            const xc = (points[i].x + points[i + 1].x) / 2 + absoluteCoords.x;
            const yc = (points[i].y + points[i + 1].y) / 2 + absoluteCoords.y;
            d += ` Q ${points[i].x + absoluteCoords.x},${points[i].y + absoluteCoords.y} ${xc},${yc}`;
        }
        d += ` Q ${points[points.length - 2].x + absoluteCoords.x},${points[points.length - 2].y + absoluteCoords.y} ${points[points.length - 1].x + absoluteCoords.x},${points[points.length - 1].y + absoluteCoords.y}`;
        return d;
    };

    const addImage = (src: string, width: number, height: number, x: number, y: number, layer?: number) => {
        const image = new Image();
        image.src = src;
        const targetLayer = layer || activeLayer;

        if (layers[targetLayer].type !== BlockType.undefined && layers[targetLayer].type !== BlockType.img) return;
        else if (layers[targetLayer].type === BlockType.undefined) setLayers({ ...layers, [targetLayer]: { name: layers[targetLayer].name, type: BlockType.img } });

        image.onload = () => {
            let imgToUpdate = [
                ...images,
                {
                    id: Date.now(),
                    name: src,
                    src: src,
                    width: width,
                    height: height,
                    position: { x, y },
                    layer: targetLayer,
                    image
                }
            ]
            imgToUpdate = imgToUpdate.sort((a, b) => a.layer - b.layer);
            setImages(imgToUpdate);
        };
    };



    return (
        <canvasProviderContext.Provider value={{
            internal: { onMouseDown, onMouseUp, onMouseMove, paths, getPathD, currentPath, selection, selectedBlock, removeLastPath, setPaths, canvasRef },
            external: { currentColor, setCurrentTool, setCurrentColor, activeLayer, setActiveLayer, layers, addImage, setLayers, currentTool, removeCanvasLayer }
        }}>
            {children}
        </canvasProviderContext.Provider>
    );
}
