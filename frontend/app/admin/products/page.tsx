'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '@/app/lib/client';

type Product = {
  id: number;
  name: string;
  price: number;
};

import { getProductImage } from "@/app/lib/product-constants";

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', price: 0 });

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0 });

  useEffect(() => {
    fetchApi('/admin/products')
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleAddStart = () => {
    setIsAdding(true);
    setAddForm({ name: '', price: 0 });
  };

  const handleAddSubmit = async () => {
    if (!addForm.name || addForm.price <= 0) {
      alert("이름과 가격을 올바르게 입력해주세요.");
      return;
    }

    try {
      const newProduct = await fetchApi('/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      setProducts((prev) => [...prev, newProduct]);
      setIsAdding(false);
      alert('등록 성공!');
    } catch (error) {
      alert('등록 중 오류 발생');
    }
  };

  const startEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditForm({ name: product.name, price: product.price });
  };

  const handleModify = async (id: number) => {
    if (!editForm.name || editForm.price <= 0) {
      alert("이름과 가격을 올바르게 입력해주세요.");
      return;
    }
    try {
      await fetchApi(`/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...editForm } : p))
      );
      setIsEditing(null);
      alert('수정 완료!');
    } catch (error) {
      alert('수정 중 오류 발생');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await fetchApi(`/admin/products/${id}`, {
        method: 'DELETE',
      });

      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert('삭제되었습니다.');
    } catch (error) {
      alert('삭제 중 오류 발생');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20 text-lg uppercase font-black tracking-widest text-zinc-400">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col gap-8">
      <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">상품 관리</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">전체 상품 목록을 중앙에서 관리합니다.</p>
        </div>

        {!isAdding && (
          <button
            onClick={handleAddStart}
            className="bg-black px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200 uppercase tracking-widest shadow-sm"
          >
            상품 추가
          </button>
        )}
      </header>

      <div className="border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 text-zinc-400 font-bold text-[11px] uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-6 py-4 w-20">번호</th>
              <th className="px-6 py-4 w-32 text-center">이미지</th>
              <th className="px-6 py-4">상품 정보</th>
              <th className="px-6 py-4 w-40 text-right">가격</th>
              <th className="px-6 py-4 w-60 text-center">작업</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {/* 추가 입력 행 */}
            {isAdding && (
              <tr className="bg-white dark:bg-black transition-colors">
                <td className="px-8 py-6 font-mono text-zinc-400 font-black">NEW</td>
                <td className="px-8 py-6 flex justify-center">
                  <div className="h-20 w-20 border border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center text-[10px] text-zinc-400 uppercase text-center font-bold px-2 dark:border-zinc-700 dark:bg-zinc-900 tracking-tighter leading-tight">
                    이미지<br />자동설정
                  </div>
                </td>
                <td className="px-6 py-6">
                  <input
                    className="flex h-11 w-full items-center border border-zinc-300 bg-white px-4 text-sm font-bold focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    placeholder="상품명을 입력하세요"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    autoFocus
                  />
                </td>
                <td className="px-6 py-6 text-right">
                  <input
                    type="number"
                    className="flex h-11 w-full items-center border border-zinc-300 bg-white px-4 text-sm font-bold text-right focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    placeholder="0"
                    value={addForm.price || ''}
                    onChange={(e) => setAddForm({ ...addForm, price: Number(e.target.value) })}
                  />
                </td>
                <td className="px-6 py-6">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={handleAddSubmit}
                      className="bg-black text-white px-5 py-2 text-xs font-bold hover:bg-zinc-800 active:scale-95 transition-all dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="bg-zinc-100 text-zinc-500 px-5 py-2 text-xs font-bold hover:bg-zinc-200 active:scale-95 transition-all dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    >
                      취소
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* 상품 목록 행 */}
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition-colors bg-white dark:bg-black"
              >
                <td className="px-8 py-6 font-mono text-zinc-400 font-black">#{product.id}</td>

                <td className="px-8 py-6 flex justify-center">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden border border-zinc-300 bg-white dark:border-zinc-800">
                    <Image
                      src={getProductImage(product.id)}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </td>

                <td className="px-6 py-5">
                  {isEditing === product.id ? (
                    <input
                      className="flex h-11 w-full items-center border border-zinc-300 bg-white px-4 text-sm font-bold focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      autoFocus
                    />
                  ) : (
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex min-h-[44px] text-blue-500 items-center text-base font-bold"
                    >
                      {product.name}
                    </Link>
                  )}
                </td>

                <td className="px-6 py-5 text-right font-bold text-lg">
                  {isEditing === product.id ? (
                    <input
                      type="number"
                      className="flex h-11 w-full items-center border border-zinc-300 bg-white px-4 text-sm font-bold text-right focus:border-black focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    />
                  ) : (
                    <span className="dark:text-zinc-100">
                      {product.price.toLocaleString()}원
                    </span>
                  )}
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                    {isEditing === product.id ? (
                      <button
                        onClick={() => handleModify(product.id)}
                        className="bg-black text-white px-5 py-2 text-xs font-bold hover:bg-zinc-800 active:scale-95 transition-all dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
                      >
                        저장
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(product)}
                        className="bg-zinc-100 text-zinc-600 px-5 py-2 text-xs font-bold hover:bg-zinc-200 active:scale-95 transition-all dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      >
                        수정
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-50 text-red-500 px-5 py-2 text-xs font-bold hover:bg-red-500 hover:text-white transition-all dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-24 text-center text-zinc-300 uppercase tracking-[0.5em] font-black text-sm italic">
            등록된 상품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}