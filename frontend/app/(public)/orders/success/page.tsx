"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function OrderSuccessPage() {
    const params = useSearchParams();
    const router = useRouter();

    const orderId = params.get("id");

    return (
        <div className="flex flex-col items-center justify-center py-20 gap-10">
            <div className="flex flex-col items-center gap-4 text-center">
                <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">🎉 주문 완료</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold max-w-sm">
                    주문이 정상적으로 접수되었습니다.
                </p>
            </div>

            {orderId && (
                <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">주문번호</span>
                    <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                        #{orderId}
                    </div>
                </div>
            )}

            <div className="mt-8 flex flex-col gap-4 w-full max-w-xs">
                <button
                    onClick={() => router.push("/")}
                    className="w-full bg-black py-4 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200 uppercase tracking-widest shadow-lg"
                >
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    );
}