'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '@/app/lib/client';

type ProductDetail = {
  id: number;
  name: string;
  price: number;
  createdDate: string;
  modifiedDate: string;
};

import { getProductImage } from "@/app/lib/product-constants";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchApi(`/admin/products/${params.id}`)
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          alert(err.message);
          router.push('/admin/products');
        });
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20 text-lg uppercase font-black tracking-widest text-zinc-400">
        로딩 중...
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="py-6 flex flex-col gap-8">
      <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">상품 상세 정보</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">상품의 세부 정보를 확인하고 관리합니다.</p>
        </div>

        <Link href="/admin/products">
          <button className="bg-black px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200 uppercase tracking-widest shadow-sm">
            목록으로 돌아가기
          </button>
        </Link>
      </header>

      <div className="border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
          {/* 이미지 영역 */}
          <div className="md:w-1/3 p-12 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950/50">
            <div className="h-64 w-64 flex-shrink-0 overflow-hidden border border-zinc-300 bg-white dark:border-zinc-800 shadow-xl relative">
              <Image
                src={getProductImage(product.id)}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 정보 영역 */}
          <div className="md:w-2/3 p-10 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">ID</span>
              <span className="font-mono text-xl font-black text-zinc-400">#{product.id}</span>
            </div>

            <div className="flex flex-col gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">상품명</span>
              <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{product.name}</span>
            </div>

            <div className="flex flex-col gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">가격</span>
              <span className="text-4xl font-black text-zinc-900 dark:text-zinc-100 italic">
                {product.price.toLocaleString()}<span className="text-xl font-bold ml-2 not-italic">원</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4 pt-10 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">등록일</span>
                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  {new Date(product.createdDate).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">수정일</span>
                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  {new Date(product.modifiedDate).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}