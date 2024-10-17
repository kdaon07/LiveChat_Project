'use client';

import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const initSocket = async () => {
            try {
                const socketIo = io({
                    path: '/api/socketio',
                });

                socketIo.on('connect', () => {
                    console.log('Socket 연결됨');
                });

                socketIo.on('chatUpdate', (newCode: string) => {
                    setMessages(prevMessages => {
                        if (prevMessages[prevMessages.length - 1] !== newCode) {
                            const updatedMessages = [...prevMessages, newCode];
                            return updatedMessages;
                        }
                        return prevMessages;
                    });
                });

                socketRef.current = socketIo;

                return () => {
                    socketIo.disconnect();
                };
            } catch (error) {
                console.error('소켓 연결 오류:', error);
            }
        };

        initSocket();
    }, []);

    const handleChatChange = (newMsg: string) => {
        if (socketRef.current) {
            socketRef.current.emit('chatUpdate', newMsg);
        }
        // 클라이언트 측에서 직접 메시지를 추가하지 않습니다.
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatChange(inputMessage);
            setInputMessage('');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow p-2 bg-white rounded overflow-auto">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        {msg}
                    </div>
                ))}
            </div>
            <div className="flex mt-2">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ color: 'black', resize: 'none' }}
                    className="flex-grow p-2 !text-black bg-white rounded-l"
                    placeholder="메시지를 입력하세요..."
                />
                <button
                    onClick={() => {
                        handleChatChange(inputMessage);
                        setInputMessage('');
                    }}
                    className="bg-blue-500 text-white px-4 rounded-r">
                    전송
                </button>
            </div>
        </div>
    );
};

export default Chat;
