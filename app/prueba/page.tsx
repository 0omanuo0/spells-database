"use client";

// create a 3d scene with threejs and areact and load a 3d model in ./scene.gltf
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Box, OrbitControls, useGLTF, DragControls, PivotControls, Html, Stats, meshBounds, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { Token } from './tokenLoader';
import { Grid, Model } from './mapLoader';
import Map3d from './3dCanvas';
import Tokens from './tokens';
import { Campign } from '@/lib/types';

interface TokenData {
    position: THREE.Vector3,
    visible: boolean,
    name: string,
    id: number

}

export default function App() {

    const [isDragging, setIsDragging] = useState(false);

    const [matrix, setMatrix] = useState(new THREE.Matrix4().setPosition(new THREE.Vector3(0.2, -0.7, -0.2)));

    const [tokenList, setTokenList] = useState<JSX.Element[]>([]);
    const [positionList, setPositionList] = useState<TokenData[]>([]);
    const [showInfoId, setShowInfoId] = useState<number>(-1);

    useEffect(() => {
        const getTokens = async () => {
            const data = await fetch('http://localhost:3000/api/campign/' + "6140ba91-2a46-4f9b-b112-fc740400a53f");
            const campign: Campign = await data.json();

            const tokens = Object.keys(campign.locations[1].data).map((key) => {
                return <Token
                    position={new THREE.Vector3(campign.locations[1].data[key].X, campign.locations[1].data[key].Z, campign.locations[1].data[key].Y)}
                    scale={0.001}
                    setIsDragging={setIsDragging}
                    setShowInfoId={setShowInfoId}
                    positionList={positionList}
                    setPositionList={setPositionList}
                    id={parseInt(key)}
                />;
            }
            );
            setTokenList(tokens)
            setPositionList(
                Object.keys(campign.locations[1].data).map((key) => {
                    return {
                        position: new THREE.Vector3(campign.locations[1].data[key].X, campign.locations[1].data[key].Y, campign.locations[1].data[key].Z),
                        visible: true,
                        name: key,
                        id: parseInt(key)
                    };
                })
            );
        }
        getTokens();

    }, []);



    useEffect(() => {
        // refresh every token
        const newTokenList: JSX.Element[] = [];
        tokenList.forEach((token, index) => {
            newTokenList[index] = (
                <Token
                    position={positionList[index].position}
                    scale={0.001}
                    setIsDragging={setIsDragging}
                    setShowInfoId={setShowInfoId}
                    positionList={positionList}
                    setPositionList={setPositionList}
                    id={index}
                />
            );
        });
        setTokenList(newTokenList);
    }, [positionList]);

    return (
        <div>
            <aside className='fixed top-0 left-0 w-1/4 h-full bg-gray-800 text-white p-4'>
                <h1 className='text-2xl font-bold'>Sidebar</h1>
                <p>Token selected: {showInfoId}</p>
                <p>{JSON.stringify(positionList)}</p>
                <button onClick={
                    () => {
                        setPositionList(
                            [
                                ...positionList,
                                {
                                    position: new THREE.Vector3(0.2, -0.7, -0.2),
                                    visible: true,
                                    name: 'token',
                                    id: tokenList.length
                                }
                            ]
                        );
                        setTokenList([
                            ...tokenList,
                            <Token
                                position={new THREE.Vector3(0.2, -0.7, -0.2)}
                                scale={0.001}
                                setIsDragging={setIsDragging}
                                setShowInfoId={setShowInfoId}
                                positionList={positionList}
                                setPositionList={setPositionList}
                                id={tokenList.length}
                            />
                        ]);
                    }}
                >
                    Add token
                </button>
            </aside>
            <Map3d className='fixed top-0 left-0 -z-10' tokenList={tokenList} isDragging={isDragging} />
        </div>
    );
}
