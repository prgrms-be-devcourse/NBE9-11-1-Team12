"use client";

import { AdminOrderDto } from "@/app/type/admin-order";
import { useEffect, useState } from "react";

export default function Orders() {
    const [orders, setOrders] = useState<AdminOrderDto[] | null>(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/orders`)
            .then(res => res.json())
            .then(data => setOrders(data));
    }, []);

    const handleCompleteOrder = (id: number) => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/orders/${id}/status`, {
            method: "PUT"
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`서버 오류: ${res.status}`)
                }
            })
            .then(() => onCompleteOrderSuccess(id))
            .catch(err => {
                alert("완료 처리 실패");
            });
    }

    const onCompleteOrderSuccess = (id: number) => {
        if (orders === null) return;

        setOrders(
            orders.map(order =>
                order.id === id
                    ? { ...order, status: true }
                    : order
            ));
        alert(`${id}번 주문 완료 처리 성공!`);
    }

    if (orders == null) {
        return (<>Loading...</>);
    }

    return (
        <>
            {orders.length === 0 && <div>주문이 없습니다.</div>}
            {orders.length !== 0 &&
                <OrderList orders={orders} onCompleteOrder={handleCompleteOrder} />
            }
        </>
    );
}

function OrderList({
    orders,
    onCompleteOrder,
}: {
    orders: AdminOrderDto[]
    onCompleteOrder: (id: number) => void
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[60px_1.5fr_1fr_1.5fr_1fr] text-center border-b pb-2">
                <span className="">번호</span>
                <span>이메일</span>
                <span>총금액</span>
                <span>주문일시</span>
                <span>상태</span>
            </div>
            {orders.map(order =>
                <OrderListItem
                    key={order.id}
                    order={order}
                    onCompleteOrder={onCompleteOrder}
                />
            )}
        </div>
    );
}

function OrderListItem({
    order,
    onCompleteOrder
}: {
    order: AdminOrderDto,
    onCompleteOrder: (id: number) => void
}) {
    return (
        <div className="grid grid-cols-[60px_1.5fr_1fr_1.5fr_1fr] items-center text-center p-3 border transition">
            <span>{order.id}</span>

            <span className="truncate">{order.customerEmail}</span>

            <span>{order.totalPrice.toLocaleString()}</span>

            <span>
                {order.createdDate.replace("T", " ").slice(0, 19)}
            </span>

            {/* <div className="flex flex-col gap-1"> */}
            {/* <span className={order.status ? "text-gray-400" : "text-red-500"}>
                    {order.status ? "완료" : "미완료"}
                </span> */}
            <button
                className="px-2 py-1 border
                       bg-blue-500 text-white 
                       hover:bg-blue-600
                       disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                onClick={() => onCompleteOrder(order.id)}
                disabled={order.status}
            >
                {order.status ? "완료" : "완료처리"}
            </button>
            {/* </div> */}
        </div>
    );
}