"use client";
import { useState } from 'react';

// ฟังก์ชันเพื่อสุ่มสี
const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const ColorChanger: React.FC = () => {
    const [color, setColor] = useState<string>('#FFFFFF'); // กำหนดสีเริ่มต้นเป็นสีขาว

    const handleClick = () => {
        setColor(getRandomColor()); // เปลี่ยนสีเมื่อคลิก
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div
                style={{
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: color,
                    margin: '0 auto',
                    border: '1px solid #000',
                    boxSizing: 'border-box', // ให้รวม border และ padding ในการคำนวณขนาด
                }}
            />
            <button
                onClick={handleClick}
                style={{ padding: '10px 10px', fontSize: '16px', marginTop: '10px' }}
            >
                Change Color
            </button>
        </div>
    );
};

export default ColorChanger;