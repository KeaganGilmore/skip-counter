import React, { useState } from 'react';
import { useGameConfig } from '../hooks/useGameConfig';
import './Game.css';
import SkipCounter from './SkipCounter';
export const Game: React.FC = () => {
    const { config, loading, error } = useGameConfig();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;



    return (
        <div className="game">
            <SkipCounter />
        </div>
    );
};