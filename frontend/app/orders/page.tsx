"use client";

import { OrderDto } from "@/app/type/order";
import {fetchApi} from "@/app/lib/client";
import {useState, useRef} from "react";

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
            .then((data) => {
                if (data.length === 0) {
                    alert("해당 이메일로 주문한 내역이 없습니다.");
                    emailInputRef.current?.focus();
                    setOrders([]);
                } else {
                    setOrders(data);
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
        <div className="flex flex-col w-full max-w-4xl mx-auto gap-8 mt-10 p-6">
            {/* 상단: 검색 영역 */}
            <div className="border-2  rounded-xl p-8 flex flex-col gap-6 shadow-sm">
                <h1 className="text-2xl font-bold text-center ">☕ 커피 주문 내역 조회</h1>
                <p className="text-gray-500 text-center">주문 시 사용하신 이메일을 입력해 주세요.</p>

                <form onSubmit={handleSearch} className="flex gap-3 items-center">
                    <input
                        ref={emailInputRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="border-2 border-gray-200 rounded-lg p-3 flex-grow outline-none focus:border-blue-400 transition-colors"
                    />
                    <button type="submit" className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-all active:scale-95">
                        조회하기
                    </button>
                </form>
            </div>

            {/* 하단: 주문 결과 영역 */}
            {orders !== null && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold border-b-2 border-gray-100 pb-2">조회 결과</h2>

                    {orders.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                            조회된 주문 내역이 없습니다.
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="border-2 border-gray-200 rounded-xl p-6 flex flex-col gap-4 hover:border-blue-200 transition-colors">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-400">주문 일자</span>
                                        <span className="font-semibold text-lg">{new Date(order.createdDate).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* 1. 상태 문구 제어: status가 true면 배송완료, false면 배송준비중 */}
                                        <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                                            order.status
                                                ? 'bg-green-100 text-green-600'  // true: 배송완료 디자인
                                                : 'bg-yellow-100 text-yellow-600' // false: 배송준비중 디자인
                                        }`}>
            {order.status ? "배송완료" : "배송준비중"}
        </span>

                                        {/* 2. 주문 취소 버튼 제어: status가 false일 때만 버튼을 렌더링함 */}
                                        {!order.status && (
                                            <button
                                                onClick={() => handleCancel(order.id)}
                                                className="border-2 border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200 px-3 py-1 rounded-lg text-sm transition-colors"
                                            >
                                                주문취소
                                        </button>
                                            )}
                                    </div>
                                </div>

                                {/* 상품 리스트 */}
                                <div className="flex flex-col gap-4">
                                    {order.orderItems.map((item) => (
                                        <div key={item.productId} className="flex gap-4 items-center p-2">
                                            {/* 상품 사진 자리 (테두리만) */}
                                            <div className="border-2 border-gray-100 w-20 h-20 rounded-lg flex items-center justify-center text-xs text-gray-400 shrink-0 bg-gray-50">
                                                IMAGE
                                            </div>
                                            <div className="flex-grow">
                                                <div className="font-bold text-gray-800">{item.productName}</div>
                                                <div className="text-sm text-gray-500">수량: {item.quantity}개</div>
                                            </div>
                                            <div className="font-semibold text-gray-700">
                                                {(item.price * item.quantity).toLocaleString()}원
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 합계 금액 */}
                                <div className="mt-2 pt-4 border-t border-gray-100 flex justify-end items-center gap-4">
                                    <span className="text-gray-500">총 결제 금액</span>
                                    <span className="text-2xl font-black text-blue-600">
                                    {order.totalPrice.toLocaleString()}원
                                </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}