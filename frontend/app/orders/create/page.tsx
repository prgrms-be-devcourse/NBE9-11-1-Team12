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

const productImages: Record<number, string> = {
    1: "/images/1.png",
    2: "/images/2.png",
    3: "/images/3.png",
    4: "/images/4.png",
};

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
        <div className="min-h-screen bg-zinc-900 text-white py-10 px-4">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="border border-zinc-700 bg-zinc-800 rounded-lg">
                    <div className="p-6 border-b border-zinc-700">
                        <h2 className="text-xl font-bold">장바구니(선택한 상품)</h2>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                        {cartItems.length === 0 ? (
                            <div className="text-zinc-400 text-center py-10">
                                선택한 상품이 없습니다.
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div
                                    key={`${item.productId}-${item.productName}`}
                                    className="border border-zinc-700 p-4 flex items-center justify-between gap-4 rounded-lg"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="relative w-20 h-20 overflow-hidden bg-zinc-700 rounded shrink-0">
                                            <Image
                                                src={productImages[item.productId] || "/images/default.png"}
                                                alt={item.productName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <div className="font-semibold text-lg">
                                                {item.productName}
                                            </div>
                                            <div className="text-zinc-400">
                                                가격: {item.price.toLocaleString()}원
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-24 text-center">
                                        <div className="bg-zinc-700 py-2 rounded">
                                            수량 {item.quantity}
                                        </div>
                                    </div>

                                    <div className="w-32 text-center font-semibold">
                                        {(item.price * item.quantity).toLocaleString()}원
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-zinc-700 grid grid-cols-2">
                        <div className="p-4 border-r border-zinc-700 text-center">
                            수량합계: {totalQuantity}개
                        </div>
                        <div className="p-4 text-center">
                            가격합계: {totalPrice.toLocaleString()}원
                        </div>
                    </div>
                </div>

                <div className="border border-zinc-700 bg-zinc-800 rounded-lg">
                    <div className="p-6 border-b border-zinc-700">
                        <h2 className="text-xl font-bold">주문 정보 입력</h2>
                    </div>

                    <div className="p-6 flex flex-col gap-6">
                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                            <label className="bg-zinc-700 px-4 py-3 text-center rounded">
                                이메일
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일 입력"
                                className="w-full bg-zinc-900 border border-zinc-600 px-4 py-3 rounded outline-none focus:border-blue-400"
                            />
                        </div>

                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                            <label className="bg-zinc-700 px-4 py-3 text-center rounded">
                                주소
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="주소 입력"
                                className="w-full bg-zinc-900 border border-zinc-600 px-4 py-3 rounded outline-none focus:border-blue-400"
                            />
                        </div>

                        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                            <label className="bg-zinc-700 px-4 py-3 text-center rounded">
                                우편번호
                            </label>
                            <input
                                type="text"
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value)}
                                placeholder="우편번호 입력"
                                className="w-full bg-zinc-900 border border-zinc-600 px-4 py-3 rounded outline-none focus:border-blue-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="border border-zinc-700 bg-zinc-800 rounded-lg">
                    <div className="p-6 flex flex-col items-center gap-4">
                        <p className="text-zinc-400">
                            주문 내용을 확인한 뒤 결제를 진행해 주세요.
                        </p>

                        <div className="w-full max-w-sm bg-zinc-700 py-4 text-center text-xl font-bold rounded">
                            총 금액: {totalPrice.toLocaleString()}원
                        </div>

                        <button
                            onClick={handleOrder}
                            disabled={isSubmitting}
                            className="w-full max-w-sm bg-blue-600 py-4 rounded font-semibold hover:bg-blue-700 disabled:bg-zinc-600 transition"
                        >
                            {isSubmitting ? "주문 처리중..." : "결제하기"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}