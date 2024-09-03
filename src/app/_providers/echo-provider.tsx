'use client'

import {useEffect, useRef} from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const useEcho = () => {
    const echoRef = useRef<Echo | null>(null);

    useEffect(() => {
        echoRef.current = new Echo({
            broadcaster: 'pusher',
            key: '',
            cluster: '',
            wsHost: 'api-ap1.pusher.com',
            wsPort: 443,
            forceTLS: false,
            encrypted: false,
            disableStats: true,
            enabledTransports: ['ws', 'wss'],
            client: new Pusher('', {
                cluster: '',
                forceTLS: false,
            }),
        });

        return () => {
            if (echoRef.current) {
                echoRef.current.disconnect();
            }
        };
    }, []);

    return echoRef.current;
};

export default useEcho;
