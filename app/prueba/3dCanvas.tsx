"use client";

// create a 3d scene with threejs and areact and load a 3d model in ./scene.gltf
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Box, OrbitControls, useGLTF, DragControls, PivotControls, Html, Stats, meshBounds, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { Token } from './tokenLoader';
import { Grid, Model } from './mapLoader';



export default function Map3d(
    { className, tokenList, isDragging }: { className: string, tokenList: JSX.Element[], isDragging: boolean}
) {
    return (
        <div className={className}>
            <Canvas
                // set the resolution to half
                resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
                shadows={true}
                style={{ height: "100vh", width: "100vw", backgroundColor: "white" }}
            >
                {/* <Box args={[1, 1, 1]} position={[0, 0, 0]} material={new THREE.MeshStandardMaterial({ color: 'red' })} /> */}
                {/* <ambientLight intensity={0.5} /> */}
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                
                {tokenList}
                {/* <Token position={new THREE.Vector3(0.2, -0.7, -0.2)} scale={0.1} /> */}
                <Grid />
                <Suspense fallback={null}>
                    <Model position={new THREE.Vector3(-2, -0.7, 2)} />
                </Suspense>
                <OrbitControls enabled={!isDragging} />
                {/* <Stats  /> */}
            </Canvas>
        </div>
    );
}
