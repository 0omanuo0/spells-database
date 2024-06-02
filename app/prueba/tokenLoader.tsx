
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { DragControls, Html, Wireframe } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import SpellCard from '@/components/card';
import { Spell } from '@/lib/types';


interface TokenData {
    position: THREE.Vector3,
    visible: boolean,
    name: string,
    id: number

}


export function Token(
    { position, scale, setIsDragging, setShowInfoId, id, positionList, setPositionList }:
        {
            position: THREE.Vector3,
            scale: number,
            setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
            setShowInfoId: React.Dispatch<React.SetStateAction<number>>,
            id: number,
            positionList: TokenData[],
            setPositionList: React.Dispatch<React.SetStateAction<TokenData[]>>
        }
) {
    const tokenId = id;
    const [scene, setScene] = useState<THREE.Group<THREE.Object3DEventMap> | null>(null);
    const loader = new GLTFLoader();
    const [showInfo, setShowInfo] = useState(false);
    const [matrix, setMatrix] = useState(new THREE.Matrix4().setPosition(position));

    const meshRef = useRef<any | null>();



    loader.load('/content/vikingmedieval_game_character-v2.glb', function (gltf) {
        // add scale on hover evert¡
        gltf.scene.position.copy(position);
        gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color: 'red' });
            }

        });
        setScene(gltf.scene);

    }, undefined, function (error) {
        console.error(error);
    });


    useEffect(() => {
        console.log(meshRef.current)
    }, [meshRef.current]);

    return (
        <DragControls
            autoTransform={false}
            matrix={matrix}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onDrag={
                (localMatrix) => {
                    const pos = new THREE.Vector3();
                    localMatrix.decompose(pos, new THREE.Quaternion(), new THREE.Vector3());
                    // round to 0.1
                    pos.x = Math.round(pos.x);
                    pos.z = Math.round(pos.z);
                    pos.y = -0.7;
                    const actualPos = new THREE.Vector3().setFromMatrixPosition(meshRef.current.matrixWorld);

                    if(positionList.some((token, index)=>{
                        console.log(token.position, actualPos, id)
                        return token.id !== tokenId && token.position.equals(actualPos)
                    }))
                    return;


                    matrix.setPosition(pos);
                    setMatrix(matrix);
                }
            }
        >
            <Suspense fallback={null}>
                <mesh
                    ref={meshRef}
                    key={tokenId}
                    visible
                    // rotation={[-Math.PI / 2, 0, 0]}
                    onClick={() => {
                        setShowInfoId(showInfo ? -1 : tokenId)
                        setShowInfo(!showInfo)
                    }}
                    material={new THREE.MeshStandardMaterial({ color: 'red' })}
                    scale={[scale, scale, scale]}
                >
                    {scene &&
                        <>
                            <Html
                                // postion the label on top of the model
                                position={[0, 540, 0]}
                                center
                            >
                                <div style={{ color: 'white', padding: '2px', backgroundColor: 'red', borderRadius: '5px' }}>
                                    {positionList[tokenId].name + "->" + tokenId}
                                </div>
                                {/* {spell && showInfo &&
                            <SpellCard spell={spell} />
                        } */}
                            </Html>

                            <primitive object={scene as object} />
                        </>
                    }

                </mesh>
            </Suspense>
        </DragControls>
    );
};