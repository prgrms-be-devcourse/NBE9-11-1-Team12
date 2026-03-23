"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function OrderSuccessPage() {
    const params = useSearchParams();
    const router = useRouter();

    const orderId = params.get("id");

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center px-4">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-10 w-full max-w-md text-center shadow-lg flex flex-col gap-6">

                <h2 className="text-3xl font-bold text-green-400">
                    🎉 주문 완료
                </h2>

                <p className="text-zinc-300">
                    주문이 정상적으로 접수되었습니다.
                </p>

                {orderId && (
                    <div className="bg-zinc-700 py-3 rounded text-lg font-semibold">
                        주문번호: {orderId}
                    </div>
                )}

                <button
                    onClick={() => router.push("/")}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition"
                >
                    홈으로 돌아가기
                </button>

            </div>
        </div>
    );
}