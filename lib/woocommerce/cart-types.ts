export type CartVariation = {
  attribute: string;
  value: string;
};

export type CartImage = {
  id: number;
  src: string;
  thumbnail: string;
  alt: string;
};

export type CartMoney = {
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator?: string;
  currency_thousand_separator?: string;
  currency_prefix?: string;
  currency_suffix?: string;
};

export type CartItem = {
  key: string;
  id: number;
  quantity: number;

  quantity_limits: {
    minimum: number;
    maximum: number;
    multiple_of: number;
    editable: boolean;
  };

  name: string;
  short_description: string;
  sku: string;
  permalink: string;

  images: CartImage[];

  variation: CartVariation[];

  prices: CartMoney & {
    price: string;
    regular_price: string;
    sale_price: string;
  };

  totals: CartMoney & {
    line_subtotal: string;
    line_subtotal_tax: string;
    line_total: string;
    line_total_tax: string;
  };
};

export type WooCart = {
  items: CartItem[];

  items_count: number;
  items_weight: number;

  coupons: Array<{
    code: string;
  }>;

  totals: CartMoney & {
    total_items: string;
    total_items_tax: string;
    total_fees: string;
    total_fees_tax: string;
    total_discount: string;
    total_discount_tax: string;
    total_shipping: string;
    total_shipping_tax: string;
    total_price: string;
    total_tax: string;
  };

  cross_sells?: unknown[];

  payment_methods?: string[];

  errors?: unknown[];
};

export type AddCartItemPayload = {
  id: number;
  quantity: number;

  variation?: Array<{
    attribute: string;
    value: string;
  }>;
};