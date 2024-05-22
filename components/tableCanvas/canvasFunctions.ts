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
    paths: Path[],
    setIsDragging: (index: number) => void,
    setRelativePosition: React.Dispatch<React.SetStateAction<{ images: Point[]; paths: Point[][] } | null>>,
    selectedBlock: { paths?: number[], images?: number[] } | null
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

    // find the path that is being clicked is near with a tolerance of 10px
    const pathIndex = paths.findIndex(
        (path) => path.points.some((point) => Math.abs(point.x - x) < 10 && Math.abs(point.y - y) < 10)
    );

    if (imageIndex === -1 && pathIndex) return false;

    if (!selectedBlock) {
        setIsDragging(imageIndex);
        if (images.length === 0) return false;
        setRelativePosition({
            images: [{
                x: x - images[imageIndex].position.x,
                y: y - images[imageIndex].position.y,
            }], paths: []
        });
        return true;
    }
    else {
        setIsDragging(NaN);
        setRelativePosition(
            {
                images: images
                    .filter((img, index) => selectedBlock.images?.includes(img.id))
                    .map(img => {
                        return {
                            x: x - img.position.x,
                            y: y - img.position.y
                        }
                    })
                , paths: paths
                    .filter((path, index) => selectedBlock.paths?.includes(path.id))
                    .map(path => path.points.map(point => {
                        return {
                            x: x - point.x,
                            y: y - point.y
                        }
                    })
                    )
            });

        return true;
    }
}




export function setPosMoving(
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    images: Img[],
    paths: Path[],
    isDragging: number | null,
    relativePosition: { images: Point[], paths: Point[][] } | null,
    selectedBlocks: { paths?: number[], images?: number[] } | null
): [Img[], Path[]] {
    if (isDragging === null) return [images, paths];
    const grid = 30;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!relativePosition) return [images, paths];

    if (!Number.isNaN(isDragging)) {
        const newImages = [...images];
        newImages[isDragging].position = {
            x: Math.round((x - relativePosition.images[0].x) / grid) * grid,
            y: Math.round((y - relativePosition.images[0].y) / grid) * grid
        };
        return [newImages, paths];
    }
    else {
        const newImages = [...images];
        const newPaths = [...paths];
        if (selectedBlocks!.images!.length > 0)
            selectedBlocks!.images?.forEach((index, i) => {
                newImages[i].position = {
                    x: Math.round((x - relativePosition.images[i].x) / grid) * grid,
                    y: Math.round((y - relativePosition.images[i].y) / grid) * grid
                };
            });
        if (selectedBlocks!.paths!.length > 0)
            selectedBlocks!.paths?.forEach((index, i) => {
                newPaths[i].points = newPaths[i].points.map((point, index) => {
                    return {
                        x: x - relativePosition.paths[i][index].x,
                        y: y - relativePosition.paths[i][index].y
                    }
                });
            });
        return [newImages, newPaths];
    }
}



export function isPathSelected(
    selection: [Point, Point],
    path: Path,
    activeLayer: number,
    absoluteCoords: Point
) {
    return path.points.every(p => {
        const x = Math.min(selection[0].x + absoluteCoords.x, selection[1].x + absoluteCoords.x);
        const y = Math.min(selection[0].y + absoluteCoords.y, selection[1].y + absoluteCoords.y);
        const width = Math.abs(selection[0].x + absoluteCoords.x - selection[1].x + absoluteCoords.x);
        const height = Math.abs(selection[0].y + absoluteCoords.y - selection[1].y + absoluteCoords.y);
        return p.x >= x && p.x <= x + width && p.y >= y && p.y <= y + height;
    }) && path.layer === activeLayer;
}

export function isImageSelected(
    selection: [Point, Point],
    img: Img,
    absoluteCoords: Point
) {
    return img.position.x >= Math.min(selection[0].x + absoluteCoords.x, selection[1].x + absoluteCoords.x) &&
        img.position.y >= Math.min(selection[0].y + absoluteCoords.y, selection[1].y + absoluteCoords.y) &&
        img.position.x + img.width <= Math.max(selection[0].x + absoluteCoords.x, selection[1].x + absoluteCoords.x) &&
        img.position.y + img.height <= Math.max(selection[0].y + absoluteCoords.y, selection[1].y + absoluteCoords.y);
}


export function removeLayer(
    layers: Layer,
    layer: number,
    setPaths: React.Dispatch<React.SetStateAction<Path[]>>,
    setLayers: React.Dispatch<React.SetStateAction<Layer>>,
    activeLayer: number,
    setActiveLayer: React.Dispatch<React.SetStateAction<number>>,
    paths: Path[]
) {
    if (defaultLayersNames.includes(layers[layer].name)) return;
    setPaths(paths.filter(path => path.layer !== layer));
    const newLayers = { ...layers };
    delete newLayers[layer];
    setLayers(newLayers);
    setActiveLayer(activeLayer === layer ? 0 : activeLayer - 1)
}