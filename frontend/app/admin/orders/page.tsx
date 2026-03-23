"use client";

import { AdminOrderDto } from "@/app/type/admin-order";
import { useEffect, useMemo, useState } from "react";


const getBatchDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const batchDate = new Date(date);
    if (date.getHours() >= 14) {
        batchDate.setDate(date.getDate() + 1);
    }
    return batchDate.toISOString().split('T')[0];
};

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
    }

    const groupedOrders = useMemo(() => {
        if (!orders) return null;

        // Grouping: DateKey -> Email -> Order[]
        const batches: Record<string, Record<string, AdminOrderDto[]>> = {};

        orders.forEach(order => {
            const batchKey = getBatchDate(order.createdDate);
            if (!batches[batchKey]) batches[batchKey] = {};
            if (!batches[batchKey][order.customerEmail]) batches[batchKey][order.customerEmail] = [];
            batches[batchKey][order.customerEmail].push(order);
        });

        return Object.entries(batches)
            .map(([date, emailGroups]) => ({
                date,
                entries: Object.entries(emailGroups).map(([email, orders]) => ({
                    email,
                    orders,
                    totalPrice: orders.reduce((sum, o) => sum + o.totalPrice, 0),
                    isAllCompleted: orders.every(o => o.status)
                }))
            }));
    }, [orders]);

    if (orders == null) {
        return (<>Loading...</>);
    }

    return (
        <div>
            <header className="mb-10">
                <h1 className="text-3xl font-bold mb-2">주문 관리</h1>
                <p>전날 14:00 ~ 당일 14:00 기준으로 주문이 묶여서 표시됩니다.</p>
            </header>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                    <p className="text-gray-400 text-lg">새로운 주문이 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {groupedOrders?.map(batch => (
                        <BatchSection
                            key={batch.date}
                            batch={batch}
                            onCompleteOrder={handleCompleteOrder}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function BatchSection({
    batch,
    onCompleteOrder
}: {
    batch: { date: string, entries: any[] },
    onCompleteOrder: (id: number) => void
}) {
    // Determine the window range for display
    const endBatchDate = new Date(batch.date);
    const startBatchDate = new Date(endBatchDate);
    startBatchDate.setDate(startBatchDate.getDate() - 1);

    const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

    return (
        <section>
            <div className="flex items-center gap-4 mb-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {batch.date} 배송분 ({formatDate(startBatchDate)} 14:00 ~ {formatDate(endBatchDate)} 14:00)
                </h2>
                <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            <div className="space-y-4">
                {batch.entries.map(entry => (
                    <OrderGroupCard
                        key={entry.email}
                        entry={entry}
                        onCompleteOrder={onCompleteOrder}
                    />
                ))}
            </div>
        </section>
    );
}

function OrderGroupCard({
    entry,
    onCompleteOrder
}: {
    entry: any,
    onCompleteOrder: (id: number) => void
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div
                className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-lg leading-none mb-1">{entry.email}</span>
                        <span className="text-sm text-gray-500">총 {entry.orders.length}개의 주문</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="block text-xs text-gray-400 uppercase font-bold">합계 금액</span>
                        <span className="text-xl font-bold text-blue-600">{entry.totalPrice.toLocaleString()}원</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${entry.isAllCompleted
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!entry.isAllCompleted) {
                                    entry.orders.filter((o: any) => !o.status).forEach((o: any) => onCompleteOrder(o.id));
                                }
                            }}
                            disabled={entry.isAllCompleted}
                        >
                            {entry.isAllCompleted ? "전체 완료됨" : "일괄 완료처리"}
                        </button>
                        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t bg-gray-50/50">
                    <div className="grid grid-cols-[80px_1fr_120px_150px_100px] gap-4 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-tighter border-b bg-white/50">
                        <span>주문번호</span>
                        <span>배송지 정보</span>
                        <span className="text-right">금액</span>
                        <span className="text-center">주문시간</span>
                        <span className="text-center">상태</span>
                    </div>
                    <div className="divide-y">
                        {entry.orders.map((order: AdminOrderDto) => (
                            <div key={order.id} className="grid grid-cols-[80px_1fr_120px_150px_100px] gap-4 px-6 py-4 items-center text-sm hover:bg-white transition-colors">
                                <span className="font-mono text-gray-400">#{order.id}</span>
                                <div className="flex flex-col">
                                    <span className="text-gray-700 font-medium">{order.address}</span>
                                    <span className="text-xs text-gray-400">[{order.postcode}]</span>
                                </div>
                                <span className="text-right font-semibold text-gray-900">
                                    {order.totalPrice.toLocaleString()}원
                                </span>
                                <span className="text-center text-gray-500 tabular-nums">
                                    {order.createdDate.replace("T", " ").slice(5, 16)}
                                </span>
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => onCompleteOrder(order.id)}
                                        disabled={order.status}
                                        className={`text-xs px-2 py-1 rounded transition ${order.status
                                            ? 'text-green-600 bg-green-50'
                                            : 'text-blue-600 bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50'
                                            }`}
                                    >
                                        {order.status ? "완료" : "개별완료"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}