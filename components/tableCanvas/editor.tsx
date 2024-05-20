"use client";

import React, { useState } from 'react';
import DrawingSvgCanvas from './svgCanvas';
import { ToolsCanvas, RemoveToolsCanvas } from './tools';
import CanvasComponent from './imgCanvas';

export interface Point {
    x: number;
    y: number;
}

export interface Path {
    id: number;
    points: Point[];
    color: string;
    layer: number;
    selected?: boolean;
}

export enum Tool {
    Pen,
    Eraser,
    Selector,
}


export default function DrawingCanvas() {


    const [currentTool, setCurrentTool] = useState<Tool>(Tool.Pen);
    const [currentColor, setCurrentColor] = useState<string>('#000000');
    const [activeLayer, setActiveLayer] = useState<number>(0);
    const [layers, setLayers] = useState<{ [n: number]: string }>({ 0: 'Base' });
    const [selection, setSelection] = useState<[Point, Point] | null>(null);
    const [paths, setPaths] = useState<Path[]>([]);
    const [currentPath, setCurrentPath] = useState<Point[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const getSvgPoint = (e: React.MouseEvent<SVGSVGElement>): Point => {
        const svg = e.currentTarget;
        const point = svg.createSVGPoint();
        point.x = e.clientX - svg.getBoundingClientRect().left;
        point.y = e.clientY - svg.getBoundingClientRect().top;
        return { x: point.x, y: point.y };
    };

    const startDrawing = (e: React.MouseEvent<SVGSVGElement>) => {
        if (currentTool === Tool.Pen) {
            const point = getSvgPoint(e);
            setCurrentPath([point]);
            setIsDrawing(true);
        }
        else if (currentTool === Tool.Selector) {
            const point = getSvgPoint(e);
            setSelection([point, point]);
        }
    };

    const draw = (e: React.MouseEvent<SVGSVGElement>) => {
        if (currentTool === Tool.Pen) {
            if (!isDrawing) return;
            const point = getSvgPoint(e);
            setCurrentPath([...currentPath, point]);
        }
        else if (currentTool === Tool.Selector) {
            if (selection === null) return;
            const point = getSvgPoint(e);
            setSelection([selection[0], point]);
        }
    };

    const stopDrawing = () => {
        if (currentTool === Tool.Pen) {
            if (currentPath.length > 0) {
                const newPath: Path = { id: Date.now(), points: currentPath, color: currentColor, layer: parseInt(activeLayer as unknown as string) };
                setPaths([...paths, newPath]);
                setCurrentPath([]);
            }
            setIsDrawing(false);
        }
        else if (currentTool === Tool.Selector) {
            if (selection) {
                const newPaths = paths
                    .map(path => {
                        const selected = path.points.every(p => {
                            const x = Math.min(selection[0].x, selection[1].x);
                            const y = Math.min(selection[0].y, selection[1].y);
                            const width = Math.abs(selection[0].x - selection[1].x);
                            const height = Math.abs(selection[0].y - selection[1].y);
                            return p.x >= x && p.x <= x + width && p.y >= y && p.y <= y + height;
                        }) && path.layer === activeLayer;
                        return { ...path, selected };
                    });
                setPaths(newPaths);
            }

            setSelection(null);
        }
    };


    const removeLastPath = () => {
        setPaths(paths.slice(0, -1));
    };

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

    const [swichDrawing, setSwichDrawing] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <ToolsCanvas setCurrentTool={setCurrentTool} setCurrentColor={setCurrentColor} />
            <div>
                <ul className='flex' key={activeLayer} >
                    <button onClick={() => setSwichDrawing(!swichDrawing)} className="px-4 py-2 bg-blue-500 text-white rounded">
                        {!swichDrawing ? 'Drawing' : 'Image'}
                    </button>
                    {
                        Object.entries(layers).map(([layer, name]) => (
                            <li key={layer}>
                                <button
                                    key={layer}
                                    onClick={() => setActiveLayer(parseInt(layer))}
                                    onContextMenu={
                                        (e) => {
                                            e.preventDefault();
                                            let newLayers = Object.values(layers);
                                            if (layers[parseInt(layer)] === 'Base') return;
                                            if (newLayers.length > 1) newLayers.pop();
                                            setPaths(paths.filter(path => path.layer !== parseInt(layer)));
                                            let newLayersObj: { [n: number]: string } = {};
                                            newLayers.forEach((name, i) => newLayersObj[i] = name);
                                            setLayers(newLayersObj);
                                            setActiveLayer(activeLayer === parseInt(layer) ? 0 : activeLayer - 1);
                                        }
                                    }
                                    className={`px-4 py-2 ${activeLayer === parseInt(layer) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded`}
                                >
                                    {name}
                                </button>
                            </li>
                        ))
                    }
                    <button onClick={() => {
                        const newLayer = Object.keys(layers).length;
                        setLayers({ ...layers, [newLayer]: `Layer ${newLayer}` });
                        setActiveLayer(newLayer);
                    }} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Add Layer
                    </button>
                </ul>
                <div className='relative'>
                    <DrawingSvgCanvas
                        className="border border-gray-800"
                        paths={paths}
                        currentPath={currentPath}
                        currentColor={currentColor}
                        startDrawing={startDrawing}
                        draw={draw}
                        stopDrawing={stopDrawing}
                        getPathD={getPathD}
                        selection={selection}
                    />
                    <CanvasComponent className={`absolute top-0 left-0 ${!swichDrawing?"pointer-events-none":""} `} />
                </div>
            </div>
            <RemoveToolsCanvas removeLastPath={removeLastPath} setPaths={setPaths} paths={paths} />
        </div>
    );
};