"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'react-toastify';

interface State {
    Pos: [number, number, number];
    Rot: [number, number, number];
}

interface Dice {
    state : State;
    Type : number;
    Bonus : number;
}


interface DiceContextProps {
    cubes: Dice[];
    setCubes: React.Dispatch<React.SetStateAction<Dice[]>>;
    clearCubes: boolean;
    setClear: React.Dispatch<React.SetStateAction<boolean>>;
    topFace: { [i: number]: number };
    setTopFace: React.Dispatch<React.SetStateAction<{ [i: number]: number }>>;
    spawnCube: ({type, bonus}: { type:number, bonus:number }) => void;
}

const DiceContext = createContext<DiceContextProps | undefined>(undefined);

export const useDice = () => {
    const context = useContext(DiceContext);
    if (!context) {
        throw new Error('useDice must be used within a DiceProvider');
    }
    return context;
};

export default function DiceProvider({ children }: { children: React.ReactNode }) {
    const [cubes, setCubes] = useState<Dice[]>([]);
    const [clearCubes, setClear] = useState(false);
    const [topFace, setTopFace] = useState<{ [i: number]: number }>({});

    const spawnCube = ({type, bonus}: { type:number, bonus:number }) => {
        setClear(true);
        const x = (Math.random() / window.innerWidth) * 2 - 1;
        const y = -(Math.random() / window.innerHeight) * 2 + 1;
        const z = 0;
        const p: [number, number, number] = [x * 5, 5, y * 5];
        const r: [number, number, number] = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
        const newCube: Dice = { state: { Pos: p, Rot: r }, Type: type, Bonus: bonus };
        setCubes([...cubes, newCube]);
    };

    useEffect(() => {
        // check if all cubes have stopped moving (if topFace lengh is equal to cubes length)
        if (Object.keys(topFace).length === cubes.length && cubes.length > 0) {
            // calulate total value of all dice with bonus and topFace.value
            const diceVaule = Object.values(topFace).reduce((acc, value) => acc + value, 0);
            const bonusValue = cubes.reduce((acc, cube) => acc + cube.Bonus, 0);
            console.log(`Total: ${cubes.length}d6 + ${bonusValue} = ${diceVaule + bonusValue}`);
            toast.success(`Total: ${cubes.length}d6 + ${bonusValue} = ${diceVaule + bonusValue}`);
            setCubes([]);
            setClear(false);
        }
    }, [topFace]);

    return (
        <DiceContext.Provider value={{ cubes, setCubes, clearCubes, setClear, topFace, setTopFace, spawnCube }}>
            {children}
        </DiceContext.Provider>
    );
}