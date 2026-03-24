"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "../lib/client";

type Product = {
  id: number;
  name: string;
  price: number;
};

import { getProductImage } from "../lib/product-constants";

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

        const data: Product[] = await fetchApi("/products", {
          cache: "no-store",
        });

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
                      src={getProductImage(product.id)}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-grow">
                    <div className="flex min-h-[40px] items-center text-lg font-bold dark:text-zinc-100">
                      {product.name}
                    </div>

                    <div className="flex items-center text-sm font-bold text-zinc-500 dark:text-zinc-400">
                      {product.price.toLocaleString()}원
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black p-1">
                  <button
                    onClick={() => handleDecrease(product.id)}
                    className="flex h-9 w-9 items-center justify-center bg-zinc-50 text-base font-bold transition-all hover:bg-zinc-200 active:scale-95 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    -
                  </button>

                  <div className="flex h-9 w-10 items-center justify-center text-sm font-black dark:text-zinc-200">
                    {quantities[product.id] || 0}
                  </div>

                  <button
                    onClick={() => handleIncrease(product.id)}
                    className="flex h-9 w-9 items-center justify-center bg-zinc-50 text-base font-bold transition-all hover:bg-zinc-200 active:scale-95 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h2 className="mb-6 text-sm font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2 dark:border-zinc-800">장바구니 확인</h2>

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

            <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <div className="text-sm font-bold text-zinc-500 uppercase tracking-tight">
                선택 수량:{" "}
                <span className="text-lg text-zinc-900 dark:text-zinc-100">{totalSelectedCount}개</span>
              </div>
              <div className="text-2xl font-black text-zinc-900 dark:text-white">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider align-middle mr-2">최종 합계</span>
                {totalPrice.toLocaleString()}원
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmitOrder}
              className="w-full md:w-auto bg-black px-12 py-5 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200 uppercase tracking-widest shadow-lg"
            >
              주문하기
            </button>
          </div>
        </>
      )}
    </>
  );
}