import { useEffect, useState } from "react";
import { useFetchImages } from "../hooks/useFetchImages";

interface FeedbackProps {
    imageSize: number;
    activeIndex: number;
    value: number;
    sequence: string[];
}

function Feedback({ imageSize, activeIndex, value, sequence }: FeedbackProps) {
    const [displayData, setDisplayData] = useState<{ right: string; bottom: string; isActive: boolean; isCorrect: boolean | null }[] | null>(null);
    const numberString = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"][value];
    const { images, imageURLs, status } = useFetchImages({ keyword: numberString, secondaryKeywords: ["skip counting"] });

    useEffect(() => {
        console.log('Fetching images...');
        if (status === 'completed') {
            console.log('Images fetched:', images);
        }
    }, [status, images]);

    useEffect(() => {
        const data: { right: string; bottom: string; isActive: boolean; isCorrect: boolean | null }[] = [];
        if (imageSize && activeIndex !== null && status === 'completed') {
            for (let i = 0; i < 12; i++) {
                const right = i < 10 ? '10px' : `${imageSize + 10}px`;
                const bottom = i < 10 ? (10 + (10 * i) + (imageSize * i)) + 'px' : (10 + ((i - 10) * 10) + ((i - 10) * imageSize)) + 'px';
                const isActive = activeIndex >= i;
                const expectedAnswer = value * i;
                const givenAnswer = parseInt(sequence[i]);
                const isCorrect = expectedAnswer === givenAnswer;
                data.push({ right: right, bottom: bottom, isActive: isActive, isCorrect: null });
                if (i > 0) {
                    data[i - 1].isCorrect = isCorrect;
                }
            }
            setDisplayData(data);
        }
    }, [imageSize, activeIndex, status, sequence, value]);

    const styles = {
        wrapper: {
            width: '100%',
            height: '100%',
            position: 'relative' as 'relative'
        },
    };

    return (
        <div style={styles.wrapper}>
            {displayData && images.length > 0 ?
                displayData.map((image, index) => (
                    <div key={index} style={{ position: 'absolute', right: image.right, bottom: image.bottom, opacity: image.isActive ? 1 : 0 }}>
                        <img src={imageURLs[images[0].image_id]} style={{ width: `${imageSize}px` }} />
                        <div>
                            {image.isCorrect ?
                                <img src="skipCounting/check.png" style={{ width: `${imageSize}px`, position: 'absolute', top: 0, left: 0 }} />
                                : <div>
                                    {activeIndex === index ? null : <img src="skipCounting/cross.png" style={{ width: `${imageSize}px`, position: 'absolute', top: 0, left: 0 }} />}
                                </div>
                            }
                        </div>
                    </div>
                ))
                : <div>Loading images...</div>
            }
        </div>
    );
}

export default Feedback;