import React, { useRef, useEffect, useState, useContext, createContext } from 'react';


interface img {
    src: string;
    width: number;
    height: number;
    position: { x: number, y: number };
    id: string;
    image: HTMLImageElement;
}

interface imgContextProps {
    images: img[];
    canvasRef: React.RefObject<HTMLCanvasElement>;
    handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseUp: () => void;
    setImages: React.Dispatch<React.SetStateAction<img[]>>;
    addImage: (src: string, width: number, height: number, x: number, y: number) => void;
}


const imgContext = createContext<imgContextProps | undefined>(undefined);


export const useCanvas = () => {
    const context = useContext(imgContext);
    if (!context) {
        throw new Error('useCanvas must be used within a CanvasProvider');
    }
    return context;
};

export default function CanvasProvider({ children, className }: { children?: React.ReactNode, className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 });
    const [images, setImages] = useState<img[]>([]);
    const image = useRef<HTMLImageElement>(new Image()).current;

    const addImage = (src: string, width: number, height: number, x: number, y: number) => {
        image.src = src;
        image.onload = () => {
            setImages((prevImages) => [
                ...prevImages,
                {
                    src: image.src,
                    width: image.width,
                    height: image.height,
                    position: { x: x, y: y },
                    id: "1",
                    image: image,
                },
            ]);
            drawImage();
        };
    }

    useEffect(() => {
        const image = useRef<HTMLImageElement>(new Image()).current;
        image.src = '/static/image/shield.png'; // Reemplaza con la URL de tu imagen
        image.onload = () => {
            setImages((prevImages) => [
                ...prevImages,
                {
                    src: image.src,
                    width: image.width,
                    height: image.height,
                    position: { x: 0, y: 0 },
                    id: "1",
                    image: image,
                },
            ]);
            drawImage();
        };
    }, [image]);

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

    useEffect(() => {
        drawImage();
    }, [images]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            console.log(images, x, y)

            const imageIndex = images.findIndex(
                (img) =>
                    x > img.position.x &&
                    x < img.position.x + img.width &&
                    y > img.position.y &&
                    y < img.position.y + img.height
            );
            console.log(imageIndex)
            setImages((prevImages) => {
                if (imageIndex !== -1) {
                    setIsDragging(imageIndex);
                    setRelativePosition({
                        x: x - prevImages[imageIndex].position.x,
                        y: y - prevImages[imageIndex].position.y,
                    });
                    return prevImages;
                }
                return prevImages;
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDragging !== null) {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                setImages((prevImages) => {
                    const newImages = [...prevImages];
                    newImages[isDragging].position.x = x - relativePosition.x;
                    newImages[isDragging].position.y = y - relativePosition.y;
                    return newImages;
                });
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(null);
    };

    return (
        <imgContext.Provider value={{ images, setImages, addImage, canvasRef, handleMouseDown, handleMouseMove, handleMouseUp }}>
            {children}
        </imgContext.Provider>
    );

}

export function Canvas({ className }: { className: string }) {
    const { canvasRef, handleMouseDown, handleMouseMove, handleMouseUp } = useCanvas();
    return (
        <canvas
            className={className}
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ border: '1px solid black' }}
        />
    );
}