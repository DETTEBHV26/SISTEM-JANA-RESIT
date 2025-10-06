
export interface PaymentItemDetails {
  id: string;
  name: string;
  price: number;
  category: string;
  section: 'murid' | 'pakej1' | 'pakej2';
}

export interface SelectedItem {
  name: string;
  category: string;
  price: number;
}

export interface FormData {
  namaPembayar: string;
  namaMurid: string;
  namaPenerima: string;
  caraBayaran: 'tunai' | 'onlineBanking' | '';
}

export interface ReceiptData extends Omit<FormData, 'caraBayaran'> {
  receiptNumber: string;
  items: SelectedItem[];
  total: number;
  date: string;
  caraBayaran: string;
}
