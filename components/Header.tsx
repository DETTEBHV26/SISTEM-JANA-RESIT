
import React from 'react';

const Header: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
                <img src="https://i.postimg.cc/HnQ8zcbr/29330281080-n.jpg" alt="Logo SK Inanam II" className="w-20 h-20 object-contain mr-4" />
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-indigo-800 mb-2">SK INANAM II</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Sistem Penjanaan Resit Pembayaran</h2>
                    <h3 className="text-lg text-gray-600">Majlis Apresiasi Tahun 6 2025</h3>
                </div>
            </div>
        </div>
    );
};

export default Header;
