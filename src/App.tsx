// src/App.tsx
import React from 'react';
import { Game } from './components/Game';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
    const { token, error } = useAuth();

    return (
        <div className="app">
            {error && <div>Error: {error}</div>}
            <Game />
        </div>
    );
};

export default App;