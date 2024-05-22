"use client";

import React, { useState } from 'react';
import DrawingSvgCanvas from './svgCanvas';
import { ToolsCanvas, RemoveToolsCanvas } from './tools';
import CanvasProvider, { useCanvas } from './editorProvider';
import { BlockType, Tool } from './canvasTypes';
import DrawingImgCanvas from './imgCanvas';



export default function DrawingCanvas() {



    const {
        external: {
            setCurrentTool, setCurrentColor, activeLayer, setActiveLayer, layers, addImage, setLayers, currentTool, removeCanvasLayer
        },
        internal: { removeLastPath, setPaths, paths }
    } = useCanvas();

    return (

        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

            <ToolsCanvas setCurrentTool={setCurrentTool} setCurrentColor={setCurrentColor} />
            <button
                onClick={() => addImage('https://via.placeholder.com/150', 150, 150, 0, 0)}
                className="px-4 py-2 bg-blue-500 text-white rounded">
                Add Image
            </button>
            <div>
                <ul className='flex' key={activeLayer} >
                    {
                        Object.entries(layers).map(([layer, content]) => (
                            <li key={layer}>
                                <button
                                    key={layer}
                                    onClick={() => setActiveLayer(parseInt(layer))}
                                    onContextMenu={
                                        (e) => {
                                            e.preventDefault();
                                            removeCanvasLayer(parseInt(layer));
                                        }
                                    }
                                    className={`px-4 py-2 ${activeLayer === parseInt(layer) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded`}
                                >
                                    {content.name}
                                </button>
                            </li>
                        ))
                    }
                    <button onClick={() => {
                        const newLayer = Object.keys(layers).length;
                        setLayers(
                            {
                                ...layers,
                                [newLayer]: {
                                    name: `Layer ${newLayer}`,
                                    type: BlockType.path
                                }
                            }
                        );
                        setActiveLayer(newLayer);
                    }} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Add Layer
                    </button>
                </ul>
                <div className='relative'>
                    <DrawingSvgCanvas
                        className="border border-black"
                    />
                    <DrawingImgCanvas
                        className={`border border-black absolute top-0 left-0 ${true ? ' pointer-events-none' : ''}`}
                    />
                </div>
            </div>
            <RemoveToolsCanvas removeLastPath={removeLastPath} setPaths={setPaths} paths={paths} />
        </div>
    );
};