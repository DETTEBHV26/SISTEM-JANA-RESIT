import type { PaymentItemDetails } from './types';

export const PAYMENT_ITEMS: PaymentItemDetails[] = [
    // Section Pertama - Pembayaran Murid
    { id: 'gambarGraduasi', name: 'Gambar Graduasi', price: 15.00, category: 'Pembayaran Pakej Murid', section: 'murid' },
    { id: 'kehadiranSICCMurid', name: 'Kehadiran SICC (Murid)', price: 60.00, category: 'Pembayaran Pakej Murid', section: 'murid' },
    { id: 'makananMurid', name: 'Makanan dan Minuman (Murid)', price: 20.00, category: 'Pembayaran Pakej Murid', section: 'murid' },
    { id: 'pengangkutanMurid', name: 'Pengangkutan (Murid)', price: 10.00, category: 'Pembayaran Pakej Murid', section: 'murid' },

    // Section Kedua - Pakej Seorang Penjaga
    { id: 'pakej1a', name: 'Kehadiran SICC (1 Penjaga)', price: 60.00, category: 'Pakej 1 Penjaga', section: 'pakej1' },
    { id: 'pakej1b', name: 'Kehadiran SICC + Pengangkutan (1 Penjaga)', price: 70.00, category: 'Pakej 1 Penjaga', section: 'pakej1' },
    { id: 'pakej1c', name: 'Kehadiran SICC + Makanan dan Minuman (1 Penjaga)', price: 80.00, category: 'Pakej 1 Penjaga', section: 'pakej1' },
    { id: 'pakej1d', name: 'Kehadiran SICC + Makanan dan Minuman + Pengangkutan (1 Penjaga)', price: 90.00, category: 'Pakej 1 Penjaga', section: 'pakej1' },

    // Section Kedua - Pakej Dua Orang Penjaga
    { id: 'pakej2a', name: 'Kehadiran SICC (2 Penjaga)', price: 120.00, category: 'Pakej 2 Penjaga', section: 'pakej2' },
    { id: 'pakej2b', name: 'Kehadiran SICC + Pengangkutan (2 Penjaga)', price: 140.00, category: 'Pakej 2 Penjaga', section: 'pakej2' },
    { id: 'pakej2c', name: 'Kehadiran SICC + Makanan dan Minuman (2 Penjaga)', price: 160.00, category: 'Pakej 2 Penjaga', section: 'pakej2' },
    { id: 'pakej2d', name: 'Kehadiran SICC + Makanan dan Minuman + Pengangkutan (2 Penjaga)', price: 180.00, category: 'Pakej 2 Penjaga', section: 'pakej2' },
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzvxqDebujPt1CiHBBu8HdDjkuKqzetG4tRJ4doX70hsM2_Lfh8IR6Cj_ADMpYFslVi/exec';