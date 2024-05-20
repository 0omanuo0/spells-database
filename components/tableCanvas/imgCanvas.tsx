"use client";

import React, { useRef, useEffect, useState } from 'react';

export default function CanvasComponent ( {className} : {className?:string}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 });
    const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
    const image = useRef<HTMLImageElement>(new Image()).current;

    useEffect(() => {
        image.src = '/static/image/shield.png'; // Reemplaza con la URL de tu imagen
        image.onload = () => {
            drawImage();
        };
    }, [image]);

    const drawImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, imagePosition.x, imagePosition.y);
            }
        }
    };

    useEffect(() => {
        drawImage();
    }, [imagePosition]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (
                x >= imagePosition.x &&
                x <= imagePosition.x + image.width &&
                y >= imagePosition.y &&
                y <= imagePosition.y + image.height
            ) {
                setRelativePosition({ x: x - imagePosition.x, y: y - imagePosition.y });
                setIsDragging(true);
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDragging) {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setImagePosition({ x: x - relativePosition.x, y: y - relativePosition.y });
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={className}
            style={{ border: '1px solid black' }}
        />
    );
};

