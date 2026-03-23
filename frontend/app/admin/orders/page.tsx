"use client";

import { fetchApi } from "@/app/lib/client";
import { AdminOrderDto } from "@/app/type/admin-order";
import { useEffect, useMemo, useState } from "react";

/**
 * 2 PM Batch Window Helper
 * Returns the date that represents the shipping batch.
 */
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
        fetchApi(`/admin/orders`)
            .then(data => {
                const sorted = (data as AdminOrderDto[]).sort((a, b) =>
                    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
                );
                setOrders(sorted);
            });
    }, []);

    const handleCompleteOrder = (id: number) => {
        fetchApi(`/admin/orders/${id}/status`, {
            method: "PUT"
        })
            .then(() => onCompleteOrderSuccess(id))
            .catch(err => alert("완료 처리 실패"));
    }

    const onCompleteOrderSuccess = (id: number) => {
        if (orders === null) return;
        setOrders(orders.map(order => order.id === id ? { ...order, status: true } : order));
    }

    const groupedOrders = useMemo(() => {
        if (!orders) return null;
        const batches: Record<string, Record<string, AdminOrderDto[]>> = {};
        orders.forEach(order => {
            const batchKey = getBatchDate(order.createdDate);
            if (!batches[batchKey]) batches[batchKey] = {};
            if (!batches[batchKey][order.customerEmail]) batches[batchKey][order.customerEmail] = [];
            batches[batchKey][order.customerEmail].push(order);
        });

        return Object.entries(batches)
            .sort((a, b) => b[0].localeCompare(a[0]))
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
        return (
            <div className="flex flex-1 items-center justify-center py-20 text-lg uppercase font-black tracking-widest text-zinc-400">
                LOADING ORDERS...
            </div>
        );
    }

    return (
        <div className="py-6 flex flex-col gap-10">
            <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">주문 관리</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">배송 배치별로 주문을 묶어서 관리합니다.</p>
                </div>
            </header>

            {orders.length === 0 ? (
                <div className="flex items-center justify-center py-32 border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 uppercase font-black tracking-widest text-zinc-400 italic">
                    새로운 주문이 없습니다.
                </div>
            ) : (
                <div className="flex flex-col gap-20">
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

function BatchSection({ batch, onCompleteOrder }: { batch: { date: string, entries: any[] }, onCompleteOrder: (id: number) => void }) {
    const endBatchDate = new Date(batch.date);
    const startBatchDate = new Date(endBatchDate);
    startBatchDate.setDate(startBatchDate.getDate() - 1);
    const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

    return (
        <section>
            <div className="mb-6 flex items-end justify-between border-b-2 border-zinc-900 dark:border-zinc-50 pb-3">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                    {batch.date} 배송분 ({formatDate(startBatchDate)} 14:00 ~ {formatDate(endBatchDate)} 14:00)
                </h2>
            </div>

            <div className="flex flex-col gap-6">
                {batch.entries.map(entry => (
                    <OrderGroupCard key={entry.email} entry={entry} onCompleteOrder={onCompleteOrder} />
                ))}
            </div>
        </section>
    );
}

function OrderGroupCard({ entry, onCompleteOrder }: { entry: any, onCompleteOrder: (id: number) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
            <div
                className={`p-6 flex items-center justify-between cursor-pointer group transition-colors ${isExpanded ? 'bg-white dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1.5 text-zinc-900 dark:text-zinc-50">
                        <div className="flex min-h-[40px] min-w-[280px] items-center border border-zinc-200 bg-white px-4 text-base font-bold dark:border-zinc-800 dark:bg-zinc-900">
                            {entry.email}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">{entry.orders.length}개의 주문 내역</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">총 결제 합계</span>
                        <div className="text-lg font-black dark:text-zinc-100">
                            {entry.totalPrice.toLocaleString()}원
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className={`flex h-11 px-6 items-center justify-center font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm ${entry.isAllCompleted
                                ? 'bg-zinc-100 text-zinc-400 cursor-default dark:bg-zinc-800 dark:text-zinc-600'
                                : 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'
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
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-zinc-300 bg-white dark:border-zinc-700 dark:bg-black p-4">
                    <div className="grid grid-cols-[80px_1fr_120px_140px_120px] gap-4 px-6 py-4 text-sm font-black text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <span className="pl-4">주문번호</span>
                        <span>배송지 정보</span>
                        <span className="text-right">금액</span>
                        <span className="text-center">주문시간</span>
                        <span className="text-center px-4">상태</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                        {entry.orders.map((order: AdminOrderDto) => (
                            <div key={order.id} className="grid grid-cols-[80px_1fr_120px_140px_120px] gap-4 px-6 py-4 items-center text-sm border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50 transition-colors bg-white dark:bg-black">
                                <span className="font-mono text-zinc-400 font-bold pl-4">#{order.id}</span>
                                <div className="flex flex-col gap-0.5">
                                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        {order.address}
                                    </div>
                                    <span className="text-sm font-bold text-zinc-400 ml-0.5">우편번호: {order.postcode}</span>
                                </div>
                                <span className="text-right font-bold text-base dark:text-zinc-200">
                                    {order.totalPrice.toLocaleString()}원
                                </span>
                                <span className="text-center text-zinc-400 font-medium tabular-nums text-sm">
                                    {order.createdDate.replace("T", " ").slice(5, 16)}
                                </span>
                                <div className="flex justify-center px-4">
                                    <button
                                        onClick={() => onCompleteOrder(order.id)}
                                        disabled={order.status}
                                        className={`flex h-9 w-full items-center justify-center font-bold text-[10px] uppercase tracking-widest border transition-all active:scale-95 ${order.status
                                            ? 'bg-zinc-50 text-zinc-300 border-zinc-100 dark:bg-zinc-900 dark:text-zinc-700 dark:border-zinc-800 cursor-default'
                                            : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200'
                                            }`}
                                    >
                                        {order.status ? "완료됨" : "완료 처리"}
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