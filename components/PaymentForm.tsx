import React from 'react';
import type { FormData } from '../types';
import { PAYMENT_ITEMS } from '../constants';

interface PaymentFormProps {
    formData: FormData;
    selectedItemIds: Set<string>;
    totalAmount: number;
    isSubmitting: boolean;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const PaymentItem: React.FC<{ id: string, name: string, price: number, isChecked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, name, price, isChecked, onChange }) => (
    <div className="flex items-center justify-between p-3 border rounded-md mb-3 hover:bg-gray-50">
        <div className="flex items-center">
            <input
                type="checkbox"
                id={id}
                name="items"
                value={id}
                checked={isChecked}
                onChange={onChange}
                className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={id} className="text-sm font-medium text-gray-700">{name}</label>
        </div>
        <span className="text-sm font-semibold text-indigo-600">RM {price.toFixed(2)}</span>
    </div>
);


const PaymentForm: React.FC<PaymentFormProps> = ({ formData, selectedItemIds, totalAmount, isSubmitting, onFormChange, onCheckboxChange, onSubmit }) => {
    
    const renderPaymentItems = (section: 'murid' | 'pakej1' | 'pakej2') => {
        return PAYMENT_ITEMS.filter(item => item.section === section).map(item => (
            <PaymentItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                isChecked={selectedItemIds.has(item.id)}
                onChange={onCheckboxChange}
            />
        ));
    }
    
    return (
        <div id="mainForm" className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <form id="paymentForm" onSubmit={onSubmit}>
                {/* Butiran Pembayar */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Butiran Pembayar</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pembayar</label>
                            <input type="text" id="namaPembayar" name="namaPembayar" value={formData.namaPembayar} onChange={onFormChange} required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Murid dan Kelas</label>
                            <input type="text" id="namaMurid" name="namaMurid" value={formData.namaMurid} onChange={onFormChange} required placeholder="Contoh: Ahmad bin Ali - 6A"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Penerima Bayaran</label>
                            <select id="namaPenerima" name="namaPenerima" value={formData.namaPenerima} onChange={onFormChange} required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Pilih Penerima</option>
                                <option value="Guru Kelas 6B (Tunai)">Guru Kelas 6B (Tunai)</option>
                                <option value="Guru Kelas 6D (Tunai)">Guru Kelas 6D (Tunai)</option>
                                <option value="Guru Kelas 6M (Tunai)">Guru Kelas 6M (Tunai)</option>
                                <option value="Guru Kelas 6I (Tunai)">Guru Kelas 6I (Tunai)</option>
                                <option value="Guru Kelas 6Z (Tunai)">Guru Kelas 6Z (Tunai)</option>
                                <option value="Online Banking (Bendahari-Suriyati Ramlee)">Online Banking (Bendahari-Suriyati Ramlee)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section Pertama - Pembayaran Murid */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 bg-blue-50 p-3 rounded-t-lg">SECTION PERTAMA - PEMBAYARAN MURID</h3>
                    {renderPaymentItems('murid')}
                </div>

                {/* Section Kedua - Pembayaran Ibu Bapa */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 bg-green-50 p-3 rounded-t-lg">SECTION KEDUA - PEMBAYARAN IBU BAPA</h3>
                    <div className="mb-4">
                        <h4 className="text-md font-semibold text-gray-700 mb-3 bg-yellow-50 p-2 rounded">PAKEJ SEORANG PENJAGA</h4>
                        {renderPaymentItems('pakej1')}
                    </div>
                    <div className="mb-4">
                        <h4 className="text-md font-semibold text-gray-700 mb-3 bg-orange-50 p-2 rounded">PAKEJ DUA ORANG PENJAGA</h4>
                        {renderPaymentItems('pakej2')}
                    </div>
                </div>

                {/* Total Pembayaran */}
                <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">Jumlah Total Pembayaran:</span>
                        <span id="totalAmount" className="text-2xl font-bold text-indigo-600">RM {totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Cara Pembayaran */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Cara Pembayaran yang TELAH Dibuat</h3>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input type="radio" id="tunai" name="caraBayaran" value="tunai" checked={formData.caraBayaran === 'tunai'} onChange={onFormChange}
                                className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="tunai" className="text-sm font-medium text-gray-700">Tunai</label>
                        </div>
                        <div className="flex items-center">
                            <input type="radio" id="onlineBanking" name="caraBayaran" value="onlineBanking" checked={formData.caraBayaran === 'onlineBanking'} onChange={onFormChange}
                                className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="onlineBanking" className="text-sm font-medium text-gray-700">Online Banking</label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button type="submit" className="bg-gradient-to-r from-indigo-600 to-green-600 text-white py-4 px-8 rounded-lg hover:from-indigo-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-lg transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
                        {isSubmitting ? 'Sedang memproses...' : 'Hantar Maklumat & Jana Resit Rasmi'}
                    </button>
                    <p className="text-sm text-gray-600 mt-2">Maklumat akan dihantar ke Google Sheets dan resit akan dijana secara automatik</p>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;