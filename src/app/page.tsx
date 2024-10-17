import CodeEditor from '@/components/CodeEditor';
import Chat from '@/components/Chat';
import React from 'react';
const Home = () => {
  return (
    <div className="flex h-screen bg-gray-900">
      <div className="w-2/5 bg-gray-800 p-4">
        <h2 className="text-lg font-bold text-white">채팅방</h2>
        <Chat />
      </div>
      <div className="w-3/5 bg-editor-color p-4">
        <h2 className="text-lg font-bold text-white">코드 에디터</h2>
        <CodeEditor />
      </div>
    </div>
  );
};

export default Home;
