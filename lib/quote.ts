export type QuoteLineInput = {
  productId?: string | null;
  productName: string;
  quantity: number;
  unit?: string | null;
  unitPrice: number;
  discountRate: number;
  note?: string | null;
  sortOrder?: number;
};

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateQuote(
  items: QuoteLineInput[],
  discountRate: number,
  taxRate: number
) {
  const normalizedItems = items.map((item, index) => {
    const quantity = Math.max(0, Number(item.quantity) || 0);
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    const lineDiscount = Math.min(100, Math.max(0, Number(item.discountRate) || 0));
    const gross = quantity * unitPrice;
    const lineTotal = roundMoney(gross * (1 - lineDiscount / 100));

    return {
      ...item,
      quantity,
      unitPrice,
      discountRate: lineDiscount,
      lineTotal,
      sortOrder: item.sortOrder ?? index
    };
  });

  const subtotal = roundMoney(normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0));
  const safeDiscountRate = Math.min(100, Math.max(0, Number(discountRate) || 0));
  const discountValue = roundMoney(subtotal * safeDiscountRate / 100);
  const afterDiscount = subtotal - discountValue;
  const safeTaxRate = Math.min(100, Math.max(0, Number(taxRate) || 0));
  const taxValue = roundMoney(afterDiscount * safeTaxRate / 100);
  const total = roundMoney(afterDiscount + taxValue);

  return {
    items: normalizedItems,
    subtotal,
    discountRate: safeDiscountRate,
    discountValue,
    taxRate: safeTaxRate,
    taxValue,
    total
  };
}

export function createQuoteNumber(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CT-${year}${month}${day}-${suffix}`;
}
