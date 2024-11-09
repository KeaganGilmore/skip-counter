import { GameConfig, GameData, Question } from '../types';

export const formatGameData = (config: GameConfig, sequence: string[], responseTimes: number[], value: number, startTime: number): GameData => {
    const questions: Question[] = sequence.slice(1).map((answer, index) => ({
        content: `What is ${index + 1} * ${value}?`,
        answer_expected: (value * (index + 1)).toString(),
        answer_given: answer,
        pass: answer === (value * (index + 1)).toString(),
        response_time: responseTimes[index] - (responseTimes[index - 1] || startTime)
    }));

    return {
        seed: config.seed,
        questions
    };
};