export interface Point {
    x: number;
    y: number;
}

export interface Img {
    id: number;
    name: string;
    src: string;
    width: number;
    height: number;
    position: Point;
    
    image: HTMLImageElement;
}

export interface Path {
    id: number;
    points: Point[];
    color: string;
    layer: number;


}


export enum BlockType {
    img,
    path
}

export type Layer = {[n: number]: {name: string, type:BlockType}}

export const defaultLayers: Layer = { 
    0: {name: "Background", type: BlockType.img}, 
    1: {name: 'Base', type: BlockType.path}, 
    2: {name: "Images", type: BlockType.img} 
};

export const defaultLayersNames = Object.values(defaultLayers).map(layer => layer.name);

export enum Tool {
    Pen,
    Eraser,
    Selector,
    Move
}
