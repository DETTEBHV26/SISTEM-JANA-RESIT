import { GOOGLE_SCRIPT_URL } from '../constants';
import type { FormData, SelectedItem, ReceiptData } from '../types';

export const submitToGoogleSheet = async (
  formData: FormData,
  selectedItems: SelectedItem[],
  totalAmount: number,
  receiptNumber: string
): Promise<void> => {
  const data = new FormData();
  data.append('secret', 'vi-secure-123');
  data.append('namaPembayar', formData.namaPembayar);
  data.append('namaMurid', formData.namaMurid);
  data.append('namaPenerima', formData.namaPenerima);
  data.append('caraBayaran', formData.caraBayaran);
  data.append('selectedItems', JSON.stringify(selectedItems));
  data.append('totalAmount', `RM ${totalAmount.toFixed(2)}`);
  data.append('timestamp', new Date().toISOString());
  data.append('receiptNumber', receiptNumber);

  // Using 'no-cors' mode means we can't inspect the response.
  // We send the request and assume success if no network error occurs.
  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: data,
  });
};
