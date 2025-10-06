import React, { useState, useMemo, useCallback } from 'react';
import type { FormData, ReceiptData, SelectedItem } from './types';
import { PAYMENT_ITEMS } from './constants';
import Header from './components/Header';
import PaymentForm from './components/PaymentForm';
import Receipt from './components/Receipt';
import { submitToGoogleSheet } from './services/googleSheetService';

const App: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        namaPembayar: '',
        namaMurid: '',
        namaPenerima: '',
        caraBayaran: '',
    });
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

    const { selectedItems, totalAmount } = useMemo(() => {
        const items: SelectedItem[] = [];
        let total = 0;
        selectedItemIds.forEach(id => {
            const item = PAYMENT_ITEMS.find(p => p.id === id);
            if (item) {
                items.push({
                    name: item.name,
                    category: item.category,
                    price: item.price,
                });
                total += item.price;
            }
        });
        return { selectedItems: items, totalAmount: total };
    }, [selectedItemIds]);

    const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: id, checked } = e.target;
        
        setSelectedItemIds(prev => {
            const newSet = new Set(prev);
            const item = PAYMENT_ITEMS.find(p => p.id === id);
            if (!item) return newSet;

            if (checked) {
                // If a package item is selected, deselect others in the same package section
                if (item.section.startsWith('pakej')) {
                    PAYMENT_ITEMS.forEach(p => {
                        if (p.section.startsWith('pakej') && p.id !== id) {
                            newSet.delete(p.id);
                        }
                    });
                }
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet;
        });
    }, []);

    const generateReceiptNumber = (): string => {
        const key = 'receiptCounter';
        let counter = 1;
        try {
            const storedCounter = localStorage.getItem(key);
            if (storedCounter) {
                const parsedCounter = parseInt(storedCounter, 10);
                // Check if parsing was successful and it's a valid number
                if (!isNaN(parsedCounter)) {
                    counter = parsedCounter + 1;
                }
            }
        } catch (error) {
            console.error("Could not access localStorage for receipt counter:", error);
            // Fallback or just continue with the default counter = 1
        }
    
        try {
            localStorage.setItem(key, counter.toString());
        } catch (error) {
            console.error("Could not save receipt counter to localStorage:", error);
        }
        
        return `r${counter.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.namaPembayar || !formData.namaMurid || !formData.namaPenerima || !formData.caraBayaran || selectedItems.length === 0) {
            alert('Sila lengkapkan semua butiran dan pilih sekurang-kurangnya satu item.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            // Generate receipt number *before* submitting
            const receiptNumber = generateReceiptNumber();

            await submitToGoogleSheet(formData, selectedItems, totalAmount, receiptNumber);

            const newReceiptData: ReceiptData = {
                ...formData,
                receiptNumber: receiptNumber,
                items: selectedItems,
                total: totalAmount,
                date: new Date().toLocaleDateString('ms-MY', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
            };
            setReceiptData(newReceiptData);

            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 5000);

            // Reset form for next entry
            setFormData({ namaPembayar: '', namaMurid: '', namaPenerima: '', caraBayaran: '' });
            setSelectedItemIds(new Set());

        } catch (error) {
            alert('Ralat semasa menghantar. Sila cuba lagi.');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNewTransaction = useCallback(() => {
        setReceiptData(null);
    }, []);
    
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Header />

            {showSuccessMessage && (
                <div id="successMessage" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="font-semibold">Berjaya dihantar!</span>
                    </div>
                </div>
            )}
            
            {receiptData ? (
                <>
                    <Receipt data={receiptData} />
                    <div className="text-center my-6">
                        <button onClick={handleNewTransaction} className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold shadow-lg transition-transform transform hover:scale-105">
                            Buat Transaksi Baru
                        </button>
                    </div>
                </>
            ) : (
                <PaymentForm
                    formData={formData}
                    selectedItemIds={selectedItemIds}
                    totalAmount={totalAmount}
                    isSubmitting={isSubmitting}
                    onFormChange={handleFormChange}
                    onCheckboxChange={handleCheckboxChange}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default App;