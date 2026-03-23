"use client";

import { OrderDto } from "@/app/type/order";
import { fetchApi } from "@/app/lib/client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function OrderSearchPage() {

    const [email, setEmail] = useState("");
    const [orders, setOrders] = useState<OrderDto[] | null>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (e: any) => {
        e.preventDefault();

        if (email.trim().length === 0) {
            alert("이메일을 입력해주세요.");
            emailInputRef.current?.focus();
            return;
        }


        fetchApi(`/orders/${email}`)
            .then((response) => {
                const orderList = response || [];

                if (orderList.length === 0) {
                    emailInputRef.current?.focus();
                    setOrders([]);
                } else {
                    const sortedOrders = orderList.sort((a: OrderDto, b: OrderDto) =>
                        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
                    setOrders(sortedOrders);
                }
            })
            .catch((error) => {
                console.error(error);
                alert("주문 내역을 불러오는 중 문제가 발생했습니다.");
                emailInputRef.current?.focus();
            });
    };

    const handleCancel = async (orderId: number) => {

        if (!confirm("정말로 이 주문을 취소하시겠습니까?")) return;

        try {

            await fetchApi(`/orders/${orderId}`, {
                method: "DELETE",
            });

            alert("주문이 성공적으로 취소되었습니다.");

            handleSearch(new Event('submit') as any);

        } catch (error: any) {
            console.error("취소 실패:", error);
            alert(error.message || "주문 취소 중 오류가 발생했습니다.");
        }
    }

    return (
        <div className="flex flex-col gap-10">
            {/* 검색 영역 */}
            <div className="border border-zinc-200 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
                <div className="mb-8 flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">☕ 커피 주문 내역 조회</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">주문 시 등록한 이메일을 통해 조회하실 수 있습니다.</p>
                </div>

                <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl gap-2">
                    <input
                        ref={emailInputRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력하세요"
                        className="flex h-12 flex-grow items-center border border-zinc-300 bg-zinc-50 px-6 text-base font-bold focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
                    />
                    <button
                        type="submit"
                        className="bg-black px-10 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200 uppercase tracking-widest shadow-sm"
                    >
                        조회
                    </button>
                </form>
            </div>

            {/* 주문 결과 영역 */}
            {orders !== null && (
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap">조회 결과</h2>
                        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="flex items-center justify-center py-32 border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 uppercase font-black tracking-widest text-zinc-400 italic text-lg">
                            조회된 주문 내역이 없습니다.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10">
                            {orders.map((order) => (
                                <div key={order.id} className="border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
                                    <div className="flex flex-wrap justify-between items-center gap-6 p-6 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                                        <div className="flex gap-10">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">주문 일자</span>
                                                <div className="flex h-8 items-center border border-zinc-200 bg-zinc-50 px-3 font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                                                    {new Date(order.createdDate).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">배송 정보</span>
                                                <div className="flex h-8 items-center border border-zinc-200 bg-zinc-50 px-4 font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                                                    [{order.postcode}] {order.address}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 ml-auto">
                                            <div className={`flex h-9 px-5 items-center border font-bold text-[11px] uppercase tracking-widest ${order.status
                                                ? 'border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50'
                                                : 'border-zinc-900 bg-black text-white dark:border-white dark:bg-white dark:text-black'
                                                }`}>
                                                {order.status ? "배송 완료" : "배송 준비 중"}
                                            </div>

                                            {!order.status && (
                                                <button
                                                    onClick={() => handleCancel(order.id)}
                                                    className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 text-[11px] font-bold transition-all border border-red-100 uppercase tracking-wider"
                                                >
                                                    주문취소
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* 상품 리스트 */}
                                    <div className="p-6 flex flex-col gap-4">
                                        {order.orderItems.map((item) => (
                                            <div key={item.productId} className="flex gap-8 items-center p-4 border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                                                <div className="relative w-24 h-24 overflow-hidden border border-zinc-300 dark:border-zinc-700">
                                                    <Image
                                                        src={`/images/${item.productId}.png`}
                                                        alt={item.productName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow flex flex-col gap-1.5">
                                                    <div className="text-base font-bold dark:text-zinc-100">
                                                        {item.productName}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider ml-0.5">수량: {item.quantity}개</span>
                                                </div>
                                                <div className="flex flex-col items-end gap-0.5 px-4">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase">결제 가격</span>
                                                    <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                                        {(item.price * item.quantity).toLocaleString()}원
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 합계 금액 */}
                                    <div className="p-6 border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 flex justify-end items-center gap-6">
                                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">최종 결제 금액</span>
                                        <div className="text-2xl font-black text-zinc-900 dark:text-white">
                                            {order.totalPrice.toLocaleString()}원
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}