"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import { Cube, PlaneCollider, SideBarrier } from '@/components/canvas/itemsCanvas';
import { useDice } from './canvas/diceProvider';

export function ButtonSpawner({ children, dice, bonus, className }: { children: React.ReactNode, dice: number, bonus: number, className?: string}) {
    const { cubes, spawnCube } = useDice();
    return (
        <button
            className={className}
            onClick={() => { spawnCube({ type: dice, bonus: bonus }) }}
        >
            { children }
        </button>
    )
}

interface Position {
    Pos: [number, number, number];
    Rot: [number, number, number];
}


export default function DiceCanvas({ className }: { className: string }) {

    const { cubes, clearCubes, setTopFace, topFace } = useDice();

    return (
        <div className={className + `${!clearCubes ? " -z-20 " : ""}` + "bg-white/60"}>
            {clearCubes &&
                <Canvas
                    shadows
                    camera={
                        {
                            position: [0, 10, 0],
                            fov: 90,
                            rotation: [0, Math.PI, 0]
                        }
                    }
                    style={{ height: "100vh", width: "100vw" }}
                >
                    <ambientLight intensity={5} />
                    <spotLight
                        position={[10, 15, 10]}
                        angle={0.3}
                        penumbra={1}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    <Physics>
                        <PlaneCollider />
                        {
                            cubes.map((dice, index) => (
                                <Cube key={index} position={dice.state} setTopFace={setTopFace} topFace={topFace} index={index} />
                            ))
                        }
                        <SideBarrier position={[0, 1, -8]} rotation={[0, 0, 0]} /> {/* Barriers */}
                        <SideBarrier position={[0, 1, 8]} rotation={[0, 0, 0]} />
                        <SideBarrier position={[-15, 1, 0]} rotation={[0, Math.PI / 2, 0]} />
                        <SideBarrier position={[15, 1, 0]} rotation={[0, Math.PI / 2, 0]} />
                    </Physics>

                    <OrbitControls
                        enablePan={false}
                        enableZoom={false}
                        enableRotate={false}
                    />
                </Canvas>
            }
        </div>
    );
};

