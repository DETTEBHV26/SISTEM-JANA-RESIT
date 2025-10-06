
import React, { useRef, useCallback, useState } from 'react';
import type { ReceiptData } from '../types';

declare const html2pdf: any;

interface ReceiptProps {
    data: ReceiptData;
}

const Receipt: React.FC<ReceiptProps> = ({ data }) => {
    const receiptRef = useRef<HTMLDivElement>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = useCallback(async () => {
        const receiptElement = receiptRef.current;
        if (!receiptElement || !data) return;

        const studentName = data.namaMurid.split(' - ')[0] || 'Murid';
        const filename = `Resit_${data.receiptNumber}_${studentName.replace(/\s+/g, '_')}.pdf`;

        setIsPrinting(true);

        // Save original styles to restore them later
        const originalStyles = {
            transform: receiptElement.style.transform,
            transformOrigin: receiptElement.style.transformOrigin,
            width: receiptElement.style.width,
            padding: receiptElement.style.padding,
        };

        try {
            // 1. Temporarily apply A4 styles for PDF capture
            receiptElement.style.width = '794px';
            receiptElement.style.padding = '1.27cm';

            // 2. Wait for all assets to load
            const images = receiptElement.querySelectorAll<HTMLImageElement>('img');
            const promises = Array.from(images).map((img: HTMLImageElement) => {
                if (img.complete) return Promise.resolve();
                return new Promise<void>(resolve => {
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // Resolve even on error to not block PDF generation
                });
            });
            await Promise.all([...promises, document.fonts.ready]);
            
            // 3. Auto-scaling logic to fit content on one page
            const A4_HEIGHT_PX = 1123; // Standard A4 height at 96 DPI
            receiptElement.getBoundingClientRect(); // Force reflow to get correct scrollHeight
            const contentHeight = receiptElement.scrollHeight;

            if (contentHeight > A4_HEIGHT_PX) {
                const scale = A4_HEIGHT_PX / contentHeight;
                receiptElement.style.transformOrigin = 'top left';
                receiptElement.style.transform = `scale(${scale})`;
            }

            // 4. Set html2pdf options for high fidelity
            const options = {
                margin: 0,
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: '#fff',
                    scrollY: 0,
                    windowWidth: receiptElement.scrollWidth,
                },
                jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css'] }
            };

            // 5. New, robust PDF generation flow
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

            if (isIOS) {
                // iOS fallback: Generate blob and open in a new tab
                const pdfOutput = await html2pdf().set(options).from(receiptElement).toPdf().get('pdf');
                const blob = pdfOutput.output('blob');
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } else {
                // Main method for desktop and Android: Direct save
                await html2pdf().set(options).from(receiptElement).save();
            }

        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Ralat menjana PDF. Cuba cetak terus menggunakan fungsi pelayar.');
            window.print();
        } finally {
            // 6. Restore original styles and reset state
            receiptElement.style.transform = originalStyles.transform;
            receiptElement.style.transformOrigin = originalStyles.transformOrigin;
            receiptElement.style.width = originalStyles.width;
            receiptElement.style.padding = originalStyles.padding;
            setIsPrinting(false);
        }
    }, [data]);

    return (
        <>
            <div id="receiptSection" className="bg-white p-0 sm:p-4 md:p-8 rounded-lg">
                <div className="receipt-a4" ref={receiptRef}>
                    {/* Header */}
                    <header className="flex justify-between items-center pb-0 border-b-2 border-gray-200">
                        <div className="flex items-center">
                            <img src="https://i.postimg.cc/HnQ8zcbr/29330281080-n.jpg" alt="Logo SK Inanam II" crossOrigin="anonymous" className="w-12 h-12 object-contain mr-2" />
                            <div>
                                <h1 className="text-base font-bold text-indigo-900">SEKOLAH KEBANGSAAN INANAM II</h1>
                                <p className="text-xs text-gray-500">PPM 321 MANGGATAL, 88450 KOTA KINABALU, SABAH</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-light text-indigo-800 tracking-widest">RESIT</h2>
                        </div>
                    </header>

                    {/* Payer Info & Receipt Details */}
                    <section className="py-1 grid grid-cols-2 gap-2">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">DIBAYAR KEPADA:</h3>
                            <p className="font-bold text-gray-800 text-sm">{data.namaPembayar}</p>
                            <p className="text-gray-600 text-xs">{data.namaMurid}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">MAKLUMAT BAYARAN:</h3>
                             <div className="grid grid-cols-2 gap-y-0 text-xs">
                                <span className="font-semibold text-gray-600">No. Resit:</span>
                                <span className="text-gray-800 font-medium">{data.receiptNumber}</span>
                                <span className="font-semibold text-gray-600">Tarikh:</span>
                                <span className="text-gray-800 font-medium">{data.date.split(',')[0]}</span>
                                <span className="font-semibold text-gray-600">Cara Bayaran:</span>
                                <span className="text-gray-800 font-medium">{data.caraBayaran === 'tunai' ? 'Tunai' : 'Online Banking'}</span>
                             </div>
                        </div>
                    </section>

                    {/* Items Table Section */}
                    <section className="receipt-table flex flex-col">
                        <table className="w-full">
                            <thead className="border-b border-gray-300">
                                <tr className="text-gray-600 uppercase text-xs">
                                    <th className="w-10 text-center font-semibold py-1 px-1">BIL</th>
                                    <th className="text-left font-semibold py-1 px-1">PERKARA</th>
                                    <th className="w-28 text-right font-semibold py-1 px-1">HARGA (RM)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200 even:bg-gray-50">
                                        <td className="text-center py-1 px-1 text-xs text-gray-700">{index + 1}</td>
                                        <td className="py-1 px-1">
                                            <p className="font-medium text-gray-800 text-xs">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                        </td>
                                        <td className="text-right py-1 px-1 font-semibold text-gray-800 text-xs">{item.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <div className="flex-grow"></div>

                        <table className="w-full">
                            <tfoot className="border-t-2 border-gray-400">
                                <tr className="font-bold">
                                    <td colSpan={2} className="text-right py-1 px-1 text-sm text-gray-800 uppercase">JUMLAH KESELURUHAN:</td>
                                    <td className="w-28 text-right py-1 px-1 text-md text-indigo-800">RM {data.total.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </section>

                    {/* Footer */}
                    <footer className="receipt-footer pt-0">
                        <div className="flex justify-between items-end">
                            <div className="text-left">
                                <p className="text-sm font-semibold text-indigo-900">Terima kasih!</p>
                                <p className="text-xs text-gray-500">Untuk pembayaran Majlis Apresiasi Tahun 6 2025.</p>
                            </div>
                            <div className="text-center w-40">
                                 <p className="font-medium h-5 flex items-end justify-center text-sm">{data.namaPenerima}</p>
                                 <div className="border-t-2 border-gray-300 mt-1 pt-1">
                                    <p className="text-xs text-gray-500">( Diterima oleh )</p>
                                 </div>
                            </div>
                        </div>
                        <div className="text-center text-xs text-gray-400 mt-1 border-t pt-0">
                            Ini adalah resit janaan komputer dan sah tanpa tandatangan. <br/>
                            Dijana pada: {data.date}
                        </div>
                    </footer>
                </div>

                <div className="no-print mt-6 text-center p-6 flex items-center justify-center space-x-4">
                    <button id="btnPdf" onClick={handlePrint} className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold disabled:opacity-50 flex items-center justify-center min-w-[200px] shadow-lg transition-transform transform hover:scale-105" disabled={isPrinting}>
                        {isPrinting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <span>Cetak / Muat Turun PDF</span>
                        )}
                    </button>
                </div>
            </div>
            <style>{`
                #receiptSection {
                    background: #fff;
                }
                .receipt-a4 {
                    width: 100%;
                    max-width: 794px;
                    margin: 0 auto;
                    background: white;
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                    box-sizing: border-box;
                    padding: 1rem;
                    
                    display: grid;
                    grid-template-rows: auto auto 1fr auto;
                    font-family: 'Poppins', sans-serif;
                    color: #333;
                }
                 @media (min-width: 840px) {
                    .receipt-a4 {
                        padding: 1.27cm;
                    }
                }
                .receipt-table {
                    display: flex;
                    flex-direction: column;
                }
                table th, table td {
                    vertical-align: middle;
                }
                
                @page {
                    size: A4;
                    margin: 0;
                }

                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    html, body {
                        width: 210mm;
                        height: 297mm;
                        background: #fff;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        break-inside: avoid;
                    }
                    *, *::before, *::after {
                        break-inside: avoid;
                    }
                    .no-print, .no-print * { 
                        display: none !important; 
                    }
                    #receiptSection {
                        padding: 0 !important;
                        box-shadow: none !important;
                    }
                    .receipt-a4 {
                        width: 210mm !important;
                        height: 297mm !important;
                        max-width: none !important;
                        min-height: unset !important;
                        margin: 0;
                        padding: 1.27cm !important;
                        box-shadow: none !important;
                        border: none !important;
                        overflow: hidden !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Receipt;
