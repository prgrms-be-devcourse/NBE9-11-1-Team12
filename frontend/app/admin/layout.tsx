import Link from "next/link";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-zinc-50 text-black dark:bg-black dark:text-white">
            <main className="flex w-full max-w-6xl flex-1 flex-col bg-white px-6 py-10 dark:bg-black min-h-screen">
                {/* Admin Navigation Bar */}
                <div className="relative mb-4 flex items-center border border-zinc-300 bg-zinc-100 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
                    <Link
                        href="/admin/products"
                        className="text-lg font-medium hover:opacity-80"
                    >
                        상품관리
                    </Link>

                    <Link
                        href="/admin"
                        className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-wide hover:opacity-80 uppercase tracking-tighter"
                    >
                        Grids & Circles
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="ml-auto text-lg font-medium hover:opacity-80"
                    >
                        주문관리
                    </Link>
                </div>

                {/* Page Content */}
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}