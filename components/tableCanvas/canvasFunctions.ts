import { Img, Layer, Path, Point, defaultLayersNames } from "./canvasTypes";

export const getSvgPoint = (e: React.MouseEvent<SVGSVGElement>): Point => {
    const svg = e.currentTarget;
    const point = svg.createSVGPoint();
    point.x = e.clientX - svg.getBoundingClientRect().left;
    point.y = e.clientY - svg.getBoundingClientRect().top;
    return { x: point.x, y: point.y };
};

export function setStartMoving(
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    images: Img[],
    setIsDragging: (index: number) => void,
    setRelativePosition: (position: Point) => void
) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const imageIndex = images.findIndex(
        (img) =>
            x > img.position.x &&
            x < img.position.x + img.width &&
            y > img.position.y &&
            y < img.position.y + img.height
    );
    setIsDragging(imageIndex);
    setRelativePosition({
        x: x - images[imageIndex].position.x,
        y: y - images[imageIndex].position.y,
    });
}

export function setPosMoving(
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    images: Img[],
    isDragging: number | null,
    relativePosition: Point,
) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return images.map((img, index) => {
        if (index === isDragging) {
            return { ...img, position: { x: x - relativePosition.x, y: y - relativePosition.y } };
        }
        return img;
    });
}

export function isSelected(
    selection: [Point, Point],
    path: Path,
    activeLayer: number
) {
    return path.points.every(p => {
        const x = Math.min(selection[0].x, selection[1].x);
        const y = Math.min(selection[0].y, selection[1].y);
        const width = Math.abs(selection[0].x - selection[1].x);
        const height = Math.abs(selection[0].y - selection[1].y);
        return p.x >= x && p.x <= x + width && p.y >= y && p.y <= y + height;
    }) && path.layer === activeLayer;
}


export function removeLayer(
    layers:Layer, 
    layer:number, 
    setPaths:React.Dispatch<React.SetStateAction<Path[]>>,
    setLayers:React.Dispatch<React.SetStateAction<Layer>>,
    activeLayer:number,
    setActiveLayer:React.Dispatch<React.SetStateAction<number>>,
    paths:Path[]
){
    if (defaultLayersNames.includes(layers[layer].name)) return;
    setPaths(paths.filter(path => path.layer !== layer));
    const newLayers = {...layers};
    delete newLayers[layer];
    setLayers(newLayers);
    setActiveLayer(activeLayer === layer ? 0 : activeLayer - 1)
}