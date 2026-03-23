"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
};

const productImages: Record<number, string> = {
  1: "/images/1.png",
  2: "/images/2.png",
  3: "/images/3.png",
  4: "/images/4.png",
};

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:8080/products", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("상품 목록 조회 실패");
        }

        const data: Product[] = await res.json();

        if (!isMounted) return;

        setProducts(data);

        const initialQuantities: Record<number, number> = {};
        data.forEach((product) => {
          initialQuantities[product.id] = 0;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("상품 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleIncrease = (productId: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleDecrease = (productId: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));
  };

  const handleOrderSearch = () => {
    router.push("/orders");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const selectedProducts = useMemo(() => {
    return products.filter((product) => (quantities[product.id] || 0) > 0);
  }, [products, quantities]);

  const totalSelectedCount = useMemo(() => {
    return selectedProducts.reduce(
      (sum, product) => sum + (quantities[product.id] || 0),
      0
    );
  }, [selectedProducts, quantities]);

  const totalPrice = useMemo(() => {
    return selectedProducts.reduce(
      (sum, product) => sum + product.price * (quantities[product.id] || 0),
      0
    );
  }, [selectedProducts, quantities]);

  const handleSubmitOrder = () => {
    if (selectedProducts.length === 0) {
      alert("수량을 1개 이상 선택한 상품이 있어야 합니다.");
      return;
    }

    const params = new URLSearchParams();

    selectedProducts.forEach((product) => {
      params.append("productId", String(product.id));
      params.append("productName", product.name);
      params.append("price", String(product.price));
      params.append("quantity", String(quantities[product.id]));
    });

    router.push(`/orders/create?${params.toString()}`);
  };

  return (
    <>
      {/* 본문 */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center py-20 text-lg">
          로딩 중...
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center py-20 text-lg text-red-500">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-20 text-lg">
          상품이 없습니다.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border border-zinc-300 bg-zinc-50 px-6 py-5 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24 overflow-hidden border border-zinc-300 bg-white dark:border-zinc-700">
                    <Image
                      src={productImages[product.id] || "/images/default.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex min-h-[48px] min-w-[320px] items-center border border-zinc-300 bg-white px-4 text-xl dark:border-zinc-700 dark:bg-zinc-800">
                      {product.name}
                    </div>

                    <div className="flex min-h-[40px] min-w-[180px] items-center border border-zinc-300 bg-white px-4 text-lg dark:border-zinc-700 dark:bg-zinc-800">
                      {product.price.toLocaleString()}원
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrease(product.id)}
                    className="flex h-11 w-11 items-center justify-center border border-zinc-300 bg-zinc-200 text-xl font-bold transition-colors hover:bg-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                  >
                    -
                  </button>

                  <div className="flex h-11 w-14 items-center justify-center border border-zinc-300 bg-white text-lg dark:border-zinc-700 dark:bg-zinc-800">
                    {quantities[product.id] || 0}
                  </div>

                  <button
                    onClick={() => handleIncrease(product.id)}
                    className="flex h-11 w-11 items-center justify-center border border-zinc-300 bg-zinc-200 text-xl font-bold transition-colors hover:bg-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 선택한 상품 요약 */}
          <div className="mt-8 border border-zinc-300 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-semibold">선택한 상품</h2>

            {selectedProducts.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400">
                아직 선택한 상품이 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedProducts.map((product) => {
                  const quantity = quantities[product.id] || 0;
                  const itemTotal = product.price * quantity;

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-700"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          {product.price.toLocaleString()}원 × {quantity}개
                        </span>
                      </div>

                      <div className="font-semibold">
                        {itemTotal.toLocaleString()}원
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <div className="text-base">
                총 선택 수량:{" "}
                <span className="font-bold">{totalSelectedCount}개</span>
              </div>
              <div className="text-lg font-bold">
                총 금액: {totalPrice.toLocaleString()}원
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmitOrder}
              className="rounded-md bg-black px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              담기
            </button>
          </div>
        </>
      )}
    </>
  );
}