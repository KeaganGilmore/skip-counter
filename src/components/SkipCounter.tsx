import React, { useState, useRef, useEffect } from 'react';
import Feedback from './Feedback';

const SkipCounterGame = ({ value = 6 }) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [sequence, setSequence] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [timer, setTimer] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [imageCount, setImageCount] = useState(0);
    const [feedbackImageSize, setFeedbackImageSize] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [responseTimes, setResponseTimes] = useState<number[]>([]);

    const styles = {
        wrapper: {
            display: 'grid',
            gridTemplateColumns: '70% 30%',
            width: '100%',
            height: '100%',
            padding: '20px',
            gap: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        gameArea: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        imageColumn: {
            width: '100%',
            height: '100%',
            position: 'relative' as 'relative',
            backgroundColor: '#FEFFFF',
        },
        startButton: {
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        input: {
            padding: '10px',
            fontSize: '16px',
            width: '100px',
            borderRadius: '4px',
            border: '1px solid #ccc'
        },
        instruction: {
            fontSize: '3em',
            fontWeight: 'bold',
            color: '#69C5DB'
        },
        sequence: {
            fontSize: '2em',
            lineHeight: '1.5',
            color: 'grey'
        },
        incorrectNumber: {
            textDecoration: 'line-through',
            color: 'red'
        },
        image: {
            width: '100%',
            height: '10%',
            position: 'absolute' as 'absolute',
            top: '-50px',
            opacity: 0,
            transition: 'all 1s ease',
            objectFit: 'contain' as 'contain'
        },
        card: {
            backgroundColor: 'white',
            padding: '1em',
            borderRadius: '1em',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.1)'
        }
    };

    const divRef = useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (gameStarted && !gameComplete) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
            inputRef.current?.focus();
            // Load the first image immediately when game starts
            setImageCount(1);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [gameStarted, gameComplete]);

    useEffect(() => {
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            const height = rect.height;
            const cellHeight = (height - (11 * 10)) / 10;
            setFeedbackImageSize(cellHeight);
        }
    }, [divRef.current]);

    const updateDimensions = () => {
        if (divRef.current) {
            const { width, height } = divRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    };

    useEffect(() => {
        // Set initial dimensions
        updateDimensions();

        // Update dimensions on window resize
        window.addEventListener('resize', updateDimensions);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    function collateStats() {
        const stats = [];
        let previousTimestamp = startTime;
        for (let i = 0; i < responseTimes.length; i++) {
            const responseTime = responseTimes[i] - (previousTimestamp || 0);
            previousTimestamp = responseTimes[i];
            stats.push({ expected_answer: value * (i + 1), given_answer: sequence[i + 1], response_time: responseTime });
        }
        return stats;
    }

    function postStats() {
        const postData = {
            description: `Skip Counting by ${value}'s`,
            start_time: startTime,
            stats: collateStats()
        };
        localStorage.setItem(`skip-counting-${value}`, JSON.stringify(postData));
    }

    const startGame = () => {
        setGameStarted(true);
        setTimer(0);
        setSequence(['0']);
        setCurrentStep(1);
        setImageCount(0); // This will be set to 1 by the useEffect
        setGameComplete(false);
        setStartTime(Date.now());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const expectedNumber = currentStep * value;
        const userNumber = parseInt(userInput);
        let nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        const currentTime = Date.now();
        setResponseTimes(prevItems => [...prevItems, currentTime]);

        if (userNumber === expectedNumber) {
            setSequence(prev => [...prev, userNumber.toString()]);
            setImageCount(prev => prev + 1);

            if (currentStep === 12) {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                setGameComplete(true);
                setGameStarted(false);
                postStats();
            }
        } else {
            setSequence(prev => [...prev, `${userNumber}`]);
        }
        setUserInput('');
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.gameArea}>
                <div style={styles.card}>
                    {gameComplete ? (
                        <div style={{ color: 'grey' }}>
                            Game Complete! Time: {timer} seconds
                        </div>
                    ) : (
                        <div>
                            {!gameStarted ? (
                                <button style={styles.startButton} onClick={startGame}>
                                    Start the Clock!
                                </button>
                            ) : (
                                <>
                                    <div style={styles.instruction}>
                                        Skip count in {value}'s
                                        <div style={{ fontSize: '14px', color: '#666', margin: '1em' }}>
                                            (Press Enter to submit your answer)
                                        </div>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            ref={inputRef}
                                            style={styles.input}
                                            type="number"
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            disabled={gameComplete}
                                        />
                                    </form>
                                    <div style={styles.sequence}>
                                        {sequence.map((num, index) => (
                                            <span key={index}>
                                                {index > 0 && ', '}
                                                <span style={
                                                    index > 0 && parseInt(num) !== index * value
                                                        ? styles.incorrectNumber
                                                        : {}
                                                }>
                                                    {num}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div style={styles.imageColumn} ref={divRef}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'grey', position: 'relative' }}>
                    {gameStarted ? (
                        <Feedback activeIndex={currentStep - 1} imageSize={feedbackImageSize} value={value} sequence={sequence} />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default SkipCounterGame;