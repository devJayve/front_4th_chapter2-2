import {CartItem, Coupon, Discount} from "../../types";


export const calculateItemTotal = (item: CartItem) => {
    const total = item.product.price * item.quantity;

    return total * (1 - getMaxApplicableDiscount(item));
};

export const getMaxApplicableDiscount = (item: CartItem) => {
    return item.product.discounts
        .filter((discount) => item.quantity >= discount.quantity)
        .map((discount) => discount.rate)
        .reduce((max, rate) => Math.max(max, rate), 0);
};

const _applyCouponDiscount = (total: number, coupon: Coupon | null): number => {
    if (!coupon) {
        return total;
    }

    return coupon.discountType === 'amount'
        ? Math.max(0, total - coupon.discountValue)
        : total * (1 - (coupon.discountValue / 100));
}

export const calculateCartTotal = (
    cart: CartItem[],
    selectedCoupon: Coupon | null
) => {
    const totalBeforeDiscount = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    const totalAfterDiscount = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const finalTotal = _applyCouponDiscount(totalAfterDiscount, selectedCoupon);

    return {
        totalBeforeDiscount: totalBeforeDiscount,
        totalAfterDiscount: finalTotal,
        totalDiscount: totalBeforeDiscount - finalTotal,
    };
};

export const updateCartItemQuantity = (
    cart: CartItem[],
    productId: string,
    newQuantity: number
): CartItem[] => {
    if (newQuantity <= 0) {
        return cart.filter((item) => item.product.id !== productId);
    }
    return cart.map((item) => item.product.id === productId ? {
        ...item,
        quantity: Math.min(newQuantity, item.product.stock)
    } : item);
};
