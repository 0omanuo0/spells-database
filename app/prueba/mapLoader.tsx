import React, { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


export function Model({ position }: { position: THREE.Vector3 }) {
    const [scene, setScene] = useState<THREE.Group<THREE.Object3DEventMap> | null>(null);
    const loader = new GLTFLoader();

    loader.load('/content/stylized_dungeon/stylized_dungeon-v1.glb', function (gltf) {
        // add scale on hover evert¡
        gltf.scene.position.copy(position);
        setScene(gltf.scene);

    }, undefined, function (error) {
        console.error(error);
    });


    return (
        <mesh visible >
            <primitive object={scene as object || {}} />
        </mesh>
    );

}

export function Grid() {
    // create a 2d grid as a plane
    const grid = new THREE.GridHelper(10, 10);
    grid.position.y = -0.5;
    grid.material.opacity = 0.5;
    grid.material.transparent = true;
    return <primitive object={grid} />;
}