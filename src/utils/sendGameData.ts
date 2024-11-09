// src/utils/sendGameData.ts
import { sendRequestV3 } from '../hooks/SendReq';
import { GameData } from '../types';

export const sendGameData = async (gameData: GameData) => {
    try {
        // Retrieve the seed from local storage
        const seed = localStorage.getItem('gameSeed');
        if (seed) {
            gameData.seed = seed;
        }

        const response = await sendRequestV3({
            endpoint: '/save-game-details',
            method: 'POST',
            body: JSON.stringify(gameData),
        });
        console.log('Game data sent successfully:', response);
    } catch (error) {
        console.error('Failed to send game data:', error);
    }
};