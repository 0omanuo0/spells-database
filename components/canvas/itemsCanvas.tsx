import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Plane, Box, useTexture } from '@react-three/drei';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { useState, useEffect, Dispatch, SetStateAction, } from 'react';
import { useRef } from 'react';
import { Euler, Mesh, Vector3 } from 'three';


type Position = {
    Pos: [number, number, number],
    Rot: [number, number, number]
};
export function PlaneCollider() {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, -0.5, 0]
    }));
    return (
        <Plane
            ref={ref as any}
            args={[10, 10]}
            receiveShadow
        >
            <meshStandardMaterial transparent opacity={0} />
        </Plane>
    );
}

export function SideBarrier({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
    const [ref] = useBox(() => ({
        type: 'Static',
        position,
        rotation,
        args: [90, 30, 0.5],  // Ajusta las dimensiones de la barrera
    }));

    return (
        <mesh ref={ref as any} position={position} rotation={rotation} castShadow receiveShadow>
            <boxGeometry args={[30, 30, 0.5]} />
            <meshStandardMaterial transparent opacity={0} />
        </mesh>
    );
}

export function Cube(
    { position, setTopFace, topFace, index }:
        { position: Position; setTopFace: Dispatch<SetStateAction<{ [i: number]: number; }>>; topFace: { [i: number]: number; }; index: number }
) {
    const texture = useTexture("/static/image/dnd/abjuration.png");
    const [ref, api] = useBox(() => ({
        mass: 1,
        position: position.Pos,
        rotation: position.Rot,
        radius: 0.1
    }));

    const velocity = useRef([0, 0, 0]);
    const [wasMoving, setWasMoving] = useState(false);
    useEffect(() => {
        api.velocity.subscribe((v) => (velocity.current = v));
    }, [api.velocity]);

    useFrame(() => {
        const isMoving = velocity.current.some((v) => Math.abs(v) > 0.01);
        if (!isMoving && wasMoving && ref.current) {
            const upVector = new Vector3(0, 1, 0);
            const rotationMatrix = new Euler().setFromQuaternion(ref.current.quaternion);
            const worldUp = upVector.applyEuler(rotationMatrix);

            // Determinar la cara superior
            const absUp = new Vector3(Math.abs(worldUp.x), Math.abs(worldUp.y), Math.abs(worldUp.z));
            if (absUp.x > absUp.y && absUp.x > absUp.z) {
                setTopFace({ ...topFace, [index]: worldUp.x > 0 ? 3 : 4 });
            } else if (absUp.y > absUp.x && absUp.y > absUp.z) {
                setTopFace({ ...topFace, [index]: worldUp.y > 0 ? 1 : 6 });
            } else {
                setTopFace({ ...topFace, [index]: worldUp.z > 0 ? 2 : 5 });
            }
        }
        setWasMoving(isMoving);
    });

    return (
        <Box
            ref={ref as any}
            args={[1, 1, 1]}
            castShadow
        >
            <meshStandardMaterial
                map={texture}
                envMapIntensity={0.9}
                metalness={0.6}
                roughness={0.1}
            />
        </Box>
    );
}