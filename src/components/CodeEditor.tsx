'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import io, { Socket } from 'socket.io-client';

const CodeEditor = () => {
  const [code, setCode] = useState('');
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

        socketIo.on('initialCode', (initialCode: string) => {
          setCode(initialCode);
        });

        socketIo.on('codeUpdate', (newCode: string) => {
          setCode(newCode);
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

  const handleCodeChange = (newCode: string | undefined) => {
    setCode(newCode || '');
    if (socketRef.current) {
      socketRef.current.emit('codeUpdate', newCode);
    }
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={code}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "'Noto Sans KR', sans-serif",
        quickSuggestions: true,
        parameterHints: { enabled: false },
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: "on",
        tabCompletion: "on",
        wordBasedSuggestions: "allDocuments",
        renderControlCharacters: true,
        renderWhitespace: "all",
        autoClosingBrackets: "never",
        autoClosingQuotes: "never",
        autoSurround: "never",
        formatOnType: false,
        formatOnPaste: false,
      }}
      onChange={handleCodeChange}
    />
  );
};

export default CodeEditor;
