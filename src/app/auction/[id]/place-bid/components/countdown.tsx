import React, {useEffect, useState} from 'react';

interface CountdownProps {
    endDate: Date;
}

const padNumber = (num: number) => String(num).padStart(2, '0');

const Countdown: React.FC<CountdownProps> = ({endDate}) => {
    const [timeLeft, setTimeLeft] = useState<number>(endDate.getTime() - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(endDate.getTime() - Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (timeLeft <= 0) {
        return <span className="text-4xl">The time is up!</span>;
    }

    return (
        <span className="text-4xl">
            {padNumber(hours)}:{padNumber(minutes)}:{padNumber(seconds)}
        </span>
    );
};

export default Countdown;
