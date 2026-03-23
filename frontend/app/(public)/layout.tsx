import Link from "next/link";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-zinc-50 text-black dark:bg-black dark:text-white">
            <main className="flex w-full max-w-6xl flex-1 flex-col bg-white px-6 py-10 dark:bg-black">
                {/* 공통 상단 바 */}
                <div className="relative mb-4 flex items-center border border-zinc-300 bg-zinc-100 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
                    <Link
                        href="/"
                        className="text-lg font-medium hover:opacity-80"
                    >
                        메인
                    </Link>

                    <Link
                        href="/"
                        className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-wide hover:opacity-80"
                    >
                        Grids & Circles
                    </Link>

                    <Link
                        href="/orders"
                        className="ml-auto text-lg font-medium hover:opacity-80"
                    >
                        주문조회
                    </Link>
                </div>

                {/* 공통 안내 문구 */}
                <div className="mb-6 flex items-center justify-center border border-zinc-200 bg-zinc-50 py-3 text-base dark:border-zinc-700 dark:bg-zinc-900">
                    당일 오후 2시 이후의 주문 건은 다음 날 배송이 시작됩니다.
                </div>

                {/* 페이지별 내용 */}
                {children}
            </main>
        </div>
    )
}