// src/utils/api.ts
import urls from '../config/urls';
import type { GameConfig, ApiResponse } from '../types';

const { SLIDES_MICROSERVICE_URL } = urls;

export const decryptGameSeed = async (seed: string): Promise<GameConfig> => {
    const token = localStorage.getItem('gameToken');
    const response = await fetch(`${SLIDES_MICROSERVICE_URL}/decrypt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ encrypted: seed }),
    });

    if (!response.ok) {
        throw new Error('Failed to decrypt game seed');
    }

    const data: ApiResponse = await response.json();
    return data.data;
};