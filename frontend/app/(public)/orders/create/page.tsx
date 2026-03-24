"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi } from "@/app/lib/client";

type CartItem = {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
};

import { getProductImage } from "@/app/lib/product-constants";

export default function OrderCreatePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const productIds = searchParams.getAll("productId");
    const productNames = searchParams.getAll("productName");
    const prices = searchParams.getAll("price");
    const quantities = searchParams.getAll("quantity");

    const cartItems: CartItem[] = productIds.map((id, index) => ({
        productId: Number(id),
        productName: productNames[index] ?? "상품명 없음",
        price: Number(prices[index] ?? 0),
        quantity: Number(quantities[index] ?? 1),
    }));

    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [postcode, setPostcode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalQuantity = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    const handleOrder = async () => {
        if (cartItems.length === 0) {
            alert("주문할 상품 정보가 없습니다.");
            return;
        }

        if (!email.trim() || !address.trim() || !postcode.trim()) {
            alert("이메일, 주소, 우편번호를 모두 입력하세요.");
            return;
        }

        const data = {
            email: email.trim(),
            address: address.trim(),
            postcode: postcode.trim(),
            orderItems: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        };

        try {
            setIsSubmitting(true);

            const result = await fetchApi("/orders", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!result?.id) {
                throw new Error("주문번호가 없습니다.");
            }

            router.push(`/orders/success?id=${result.id}`);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "주문 실패");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-10">
            {/* 장바구니 리스트 */}
            <section>
                <div className="mb-6 flex items-center gap-4">
                    <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">주문 상품 확인</h2>
                    <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
                </div>

                <div className="flex flex-col gap-4">
                    {cartItems.length === 0 ? (
                        <div className="flex items-center justify-center py-20 border border-dashed border-zinc-300 text-zinc-400 font-bold uppercase tracking-widest italic">
                            선택한 상품이 없습니다.
                        </div>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <div
                                    key={`${item.productId}-${item.productName}`}
                                    className="flex flex-wrap md:flex-nowrap gap-8 items-center p-6 border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
                                >
                                    <div className="relative w-24 h-24 overflow-hidden border border-zinc-200 bg-white dark:border-zinc-800 shrink-0">
                                        <Image
                                            src={getProductImage(item.productId)}
                                            alt={item.productName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-grow flex flex-col gap-1.5 min-w-[200px]">
                                        <div className="flex min-h-[40px] items-center text-lg font-bold dark:text-zinc-100">
                                            {item.productName}
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="font-black text-zinc-400 uppercase tracking-widest ml-1">가격: {item.price.toLocaleString()}원</span>
                                            <span className="font-black text-black dark:text-white uppercase tracking-widest">수량: {item.quantity}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-0.5 px-4 ml-auto">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase">소계</span>
                                        <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                            {(item.price * item.quantity).toLocaleString()}원
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex flex-wrap md:flex-nowrap justify-center gap-12 items-center p-8 border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">총 주문 수량</span>
                                    <span className="text-xl font-black">{totalQuantity}개</span>
                                </div>

                                <div className="w-px h-12 bg-zinc-300 dark:bg-zinc-700 mx-4 hidden md:block"></div>

                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">총 결제 합계</span>
                                    <div className="text-3xl font-black text-zinc-900 dark:text-white">
                                        {totalPrice.toLocaleString()}원
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section >

            {/* 배송 정보 입력 */}
            <section>
                <div className="mb-6 flex items-center gap-4">
                    <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">배송 정보 입력</h2>
                    <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
                </div>

                <div className="flex flex-col gap-6 p-10 border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">이메일 주소</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일 입력"
                            className="flex h-12 w-full items-center border border-zinc-300 bg-zinc-50 px-6 text-base font-bold focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">배송지 주소</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="주소 입력"
                            className="flex h-12 w-full items-center border border-zinc-300 bg-zinc-50 px-6 text-base font-bold focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-1">우편번호</label>
                        <input
                            type="text"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            placeholder="우편번호 입력"
                            className="flex h-12 w-48 items-center border border-zinc-300 bg-zinc-50 px-6 text-base font-bold focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                        />
                    </div>
                </div>
            </section >

            {/* 결제 요약 */}
            <section>
                <div className="mb-6 flex items-center gap-4">
                    <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">결제 정보 확인</h2>
                    <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 p-10 border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-lg">
                    <div className="flex flex-col gap-1 w-full text-right md:text-left">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">최종 결제 금액</span>
                        <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">
                            {totalPrice.toLocaleString()}원
                        </div>
                    </div>
                    <button
                        onClick={handleOrder}
                        disabled={isSubmitting}
                        className="w-full bg-black py-5 text-lg font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:bg-zinc-200 disabled:text-zinc-400 dark:bg-white dark:text-black dark:hover:bg-zinc-200 uppercase tracking-widest shadow-md"
                    >
                        {isSubmitting ? "처리 중..." : "결제하기"}
                    </button>
                </div>
            </section>
        </div>
    );
}