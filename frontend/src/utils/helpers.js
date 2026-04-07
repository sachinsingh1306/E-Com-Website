export const readStoredJson = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const readStoredValue = (key, fallback = "") => {
  if (typeof window === "undefined") {
    return fallback;
  }

  return window.localStorage.getItem(key) ?? fallback;
};

export const writeStoredJson = (key, value) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const writeStoredValue = (key, value) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  }
};

export const removeStoredValue = (key) => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  }
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const getErrorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || fallback;

export const calculateCartTotals = (cartItems) => {
  const itemsPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.qty),
    0
  );
  const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
  const shippingPrice = itemsPrice > 1000 || itemsPrice === 0 ? 0 : 50;
  const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

  return {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  };
};
