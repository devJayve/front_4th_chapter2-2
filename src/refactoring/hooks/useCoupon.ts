import {Coupon} from "../../types.ts";
import {useState} from "react";

export const useCoupons = (initialCoupons: Coupon[]) => {
    const [coupons, setCoupons] = useState(initialCoupons);

    return {coupons: coupons, addCoupon: () => undefined};
};
