"use client";
import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
}

const LuckyDrawApp = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [winners, setWinners] = useState<User[]>([]);
  const [previousWinners, setPreviousWinners] = useState<User[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [numberOfWinners, setNumberOfWinners] = useState(1);
  const [error, setError] = useState('');
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/users');
      const data = await response.json();

      if (data) {
        setUsers(data);
      } else {
        setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
      }
    } catch (error) {
      setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    }
  };

  const selectWinners = () => {
    if (users.length === 0) {
      setError('ไม่มีผู้เข้าร่วมในระบบ');
      return;
    }

    const availableUsers = users.filter(user =>
      !previousWinners.some(winner => winner.id === user.id)
    );

    if (numberOfWinners > availableUsers.length) {
      setError('จำนวนผู้ชนะมากกว่าผู้เข้าร่วมที่ยังไม่ถูกสุ่ม');
      return;
    }

    setIsSpinning(true);
    setError('');

    setTimeout(() => {
      const shuffled = [...availableUsers].sort(() => Math.random() - 0.5);
      const selectedWinners = shuffled.slice(0, numberOfWinners);

      setWinners(selectedWinners);
      setPreviousWinners((prev) => [...prev, ...selectedWinners]);
      setIsSpinning(false);
    }, 2000);
  };

  const reloadGame = () => {
    setWinners([]);
    setPreviousWinners([]);
    setNumberOfWinners(1);
  };

  const remainingUsersCount = users.length - previousWinners.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 flex justify-center items-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow-xl p-6 flex flex-col">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-4">
          🎉 ระบบสุ่มผู้โชคดี 🎉
        </h1>

        <div className="mb-10">
          <label className="block text-gray-700 text-lg font-semibold mb-4">
            จำนวนผู้โชคดี:
          </label>
          <input
            type="number"
            value={numberOfWinners}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setNumberOfWinners(isNaN(value) ? 0 : value);
            }}
            className="shadow-lg appearance-none border-2 border-purple-200 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-lg"
          />
        </div>

        <div className="text-center mb-12">
          {previousWinners.length === users.length ? (
            <button
              onClick={reloadGame}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl transform transition-all hover:scale-105 hover:shadow-lg"
            >
              เริ่มต้นใหม่
            </button>
          ) : (
            <button
              onClick={selectWinners}
              disabled={isSpinning || previousWinners.length === users.length}
              className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl transform transition-all ${isSpinning || previousWinners.length === users.length
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105 hover:shadow-lg'
                }`}
            >
              {isSpinning ? 'กำลังสุ่ม...' : 'สุ่มผู้โชคดี'}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-bold">เกิดข้อผิดพลาด</p>
            <p>{error}</p>
          </div>
        )}

        {winners.length > 0 && (
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 mb-8 shadow-xl">
            <h2 className="text-3xl font-bold text-center text-white mb-6 animate-pulse">
              🎊 ผู้โชคดี 🎊
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {winners.map((winner, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:rotate-1"
                >
                  <p className="text-2xl font-semibold text-gray-800 text-center">
                    {winner.username}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <span className="inline-block bg-yellow-400 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                      ผู้ชนะ #{index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-start ml-2 mb-8">
          <p className="text-base font-bold text-black">
            ผู้เข้าร่วมที่ยังไม่ถูกสุ่ม: {remainingUsersCount} คน
          </p>
        </div>

        {showUsers && users.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ผู้เข้าร่วมทั้งหมด ({users.length})
            </h3>
            <div className="bg-white rounded-xl p-6 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg p-3 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <p className="font-semibold text-gray-800 text-center">{user.username}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto flex justify-end mb-4">
          <button
            onClick={() => setShowUsers(prev => !prev)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full text-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showUsers ? 'ซ่อนผู้เข้าร่วมทั้งหมด' : 'แสดงผู้เข้าร่วมทั้งหมด'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LuckyDrawApp;
