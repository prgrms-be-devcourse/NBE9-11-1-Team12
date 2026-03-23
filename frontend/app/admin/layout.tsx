import Link from "next/link";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto gap-8 mt-10 p-6">
            <nav className="flex gap-4">
                <Link href="/admin/products" className="text-lg font-medium hover:opacity-80">상품</Link>
                <Link href="/admin/orders" className="text-lg font-medium hover:opacity-80">주문</Link>
            </nav>
            {children}
        </div>
    )
}