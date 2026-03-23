// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';

// type Product = {
//   id: number;
//   name: string;
//   price: number;
// };

// const productImages: Record<number, string> = {
//   1: "/images/1.png",
//   2: "/images/2.png",
//   3: "/images/3.png",
//   4: "/images/4.png",
// };

// export default function AdminProductPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // 추가 모드 상태 관리
//   const [isAdding, setIsAdding] = useState(false);
//   const [addForm, setAddForm] = useState({ name: '', price: 0 });

//   // 수정 모드 상태 관리
//   const [isEditing, setIsEditing] = useState<number | null>(null);
//   const [editForm, setEditForm] = useState({ name: '', price: 0 });

//   useEffect(() => {
//     fetch('http://localhost:8080/admin/products')
//       .then((res) => {
//         if (!res.ok) throw new Error('목록 로드 실패');
//         return res.json();
//       })
//       .then((data) => {
//         setProducts(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error(error);
//         setLoading(false);
//       });
//   }, []);

//   const handleAddStart = () => {
//     setIsAdding(true);
//     setAddForm({ name: '', price: 0 }); // 초기화
//   };

//   const handleAddSubmit = async () => {
//     if (!addForm.name || addForm.price <= 0) {
//       alert("이름과 가격을 올바르게 입력해주세요.");
//       return;
//     }

//     try {
//       const res = await fetch('http://localhost:8080/admin/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(addForm),
//       });

//       if (res.ok) {
//         const newProduct = await res.json();
//         // 백엔드 응답 구조가 { data: { ... } } 라면 newProduct.data 사용
//         setProducts((prev) => [...prev, newProduct]);
//         setIsAdding(false);
//         alert('등록 성공!');
//       }
//     } catch (error) {
//       alert('등록 중 오류 발생');
//     }
//   };

//   const startEdit = (product: Product) => {
//     setIsEditing(product.id);
//     setEditForm({ name: product.name, price: product.price });
//   };

//   const handleModify = async (id: number) => {
//     try {
//       const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editForm),
//       });

//       if (res.ok) {
//         setProducts((prev) =>
//           prev.map((p) => (p.id === id ? { ...p, ...editForm } : p))
//         );
//         setIsEditing(null);
//         alert('수정 완료!');
//       }
//     } catch (error) {
//       alert('수정 중 오류 발생');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm('정말 삭제하시겠습니까?')) return;

//     try {
//       const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
//         method: 'DELETE',
//       });

//       if (!res.ok) throw new Error('삭제 실패');

//       setProducts((prev) => prev.filter((p) => p.id !== id));
//       alert('삭제되었습니다.');
//     } catch (error) {
//       alert('삭제 중 오류 발생');
//     }
//   };

//   if (loading) return <div className="p-10 text-center text-lg font-bold">로딩 중...</div>;

//   return (
//     <div className="flex min-h-screen flex-col items-center bg-zinc-50 text-black font-sans">
//       <main className="flex w-full max-w-6xl flex-1 flex-col bg-white px-6 py-10 shadow-sm border-x border-zinc-200">

//         {/* 상단 바 */}
//         <div className="relative mb-8 flex items-center border border-zinc-300 bg-zinc-100 px-6 py-4">
//           <Link href="/admin/products" className="text-lg font-bold hover:text-blue-600 transition-colors">
//             상품관리
//           </Link>

//           <button
//             onClick={() => router.push('/')}
//             className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-wide hover:opacity-80"
//           >
//             Grids & Circles
//           </button>

//           <Link href="/admin/orders" className="ml-auto text-lg text-zinc-600 hover:text-black transition-colors">
//             주문관리
//           </Link>
//         </div>

//         {/* ✅ 제목 및 추가 버튼 섹션 (한 줄 배치) */}
//         <div className="flex items-center justify-between mb-6 px-2">
//           <h1 className="text-2xl font-bold text-zinc-800 border-l-4 border-black pl-4">
//             상품 목록
//           </h1>

//           <button
//             onClick={handleAddStart}
//             className="px-6 py-2 bg-black text-white font-bold hover:bg-zinc-800 transition-colors shadow-sm"
//           >
//             상품 추가
//           </button>
//         </div>

//         <div className="overflow-hidden border border-zinc-300 bg-white shadow-sm">
//           <table className="w-full border-collapse text-left">
//             <thead>
//               <tr className="border-b border-zinc-300 bg-zinc-100 text-zinc-700 font-bold">
//                 <th className="p-4 w-16">ID</th>
//                 <th className="p-4 w-24">이미지</th>
//                 <th className="p-4">상품명</th>
//                 <th className="p-4 w-32">가격</th>
//                 <th className="p-4 w-48 text-center">기능</th>
//               </tr>
//             </thead>

//             {/* <tbody> 하나만 사용! */}
//             <tbody>
//               {/* 1. 추가 입력 행 (활성화 시 맨 위에 등장) */}
//               {isAdding && (
//                 <tr className="border-b-2 border-blue-400 bg-blue-50 transition-all">
//                   <td className="p-4 text-blue-600 font-bold">NEW</td>
//                   <td className="p-4">
//                     <div className="h-16 w-16 border border-dashed border-blue-300 bg-white flex items-center justify-center text-zinc-400 text-xs text-center">
//                       이미지<br />자동설정
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <input
//                       className="border border-blue-300 px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="새 상품명 입력"
//                       value={addForm.name}
//                       onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
//                       autoFocus
//                     />
//                   </td>
//                   <td className="p-4">
//                     <input
//                       type="number"
//                       className="border border-blue-300 px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="가격 입력"
//                       value={addForm.price || ''}
//                       onChange={(e) => setAddForm({ ...addForm, price: Number(e.target.value) })}
//                     />
//                   </td>
//                   <td className="p-4 text-center">
//                     <div className="flex justify-center gap-2">
//                       <button
//                         onClick={handleAddSubmit}
//                         className="px-4 py-1.5 bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
//                       >
//                         저장
//                       </button>
//                       <button
//                         onClick={() => setIsAdding(false)}
//                         className="px-4 py-1.5 bg-zinc-400 text-white font-bold hover:bg-zinc-500"
//                       >
//                         취소
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//               {products.map((product) => (
//                 <tr
//                   key={product.id}
//                   className="border-b border-zinc-200 hover:bg-zinc-50 transition-colors"
//                 >
//                   <td className="p-4 text-zinc-500">{product.id}</td>

//                   <td className="p-4">
//                     <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-zinc-200 bg-zinc-100">
//                       <Image
//                         src={productImages[product.id] || "/images/1.png"} 
//                         alt={product.name}
//                         width={64}
//                         height={64}
//                         className="object-cover w-full h-full"
//                       />
//                     </div>
//                   </td>

//                   <td className="p-4 font-medium">
//                     {isEditing === product.id ? (
//                       <input
//                         className="border border-zinc-300 px-2 py-1 w-full focus:outline-none focus:border-blue-500"
//                         value={editForm.name}
//                         onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                         autoFocus
//                       />
//                     ) : (
//                       <Link
//                         href={`/admin/products/${product.id}`}
//                         className="font-semibold text-blue-600 hover:underline decoration-2 underline-offset-4"
//                       >
//                         {product.name}
//                       </Link>
//                     )}
//                   </td>

//                   <td className="p-4 font-bold text-zinc-800">
//                     {isEditing === product.id ? (
//                       <input
//                         type="number"
//                         className="border border-zinc-300 px-2 py-1 w-full focus:outline-none focus:border-blue-500"
//                         value={editForm.price}
//                         onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
//                       />
//                     ) : (
//                       `${product.price.toLocaleString()}원`
//                     )}
//                   </td>

//                   <td className="p-4 text-center">
//                     <div className="flex justify-center gap-2">
//                       {/* ✅ 수정/저장 버튼 */}
//                       {isEditing === product.id ? (
//                         <button
//                           onClick={() => handleModify(product.id)}
//                           className="px-4 py-1.5 border border-blue-500 bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
//                         >
//                           저장
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => startEdit(product)}
//                           className="px-4 py-1.5 border border-zinc-300 bg-zinc-200 hover:bg-zinc-300 transition-colors"
//                         >
//                           수정
//                         </button>
//                       )}

//                       {/* ✅ 삭제 버튼 */}
//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         className="px-4 py-1.5 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
//                       >
//                         삭제
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {products.length === 0 && (
//             <div className="py-24 text-center text-zinc-400 italic font-medium">
//               등록된 상품이 없습니다.
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', price: 0 });

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0 });

  useEffect(() => {
    fetch('http://localhost:8080/admin/products')
      .then((res) => {
        if (!res.ok) throw new Error('목록 로드 실패');
        return res.json();
      })
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
      const res = await fetch('http://localhost:8080/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct]);
        setIsAdding(false);
        alert('등록 성공!');
      }
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
      const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...editForm } : p))
        );
        setIsEditing(null);
        alert('수정 완료!');
      }
    } catch (error) {
      alert('수정 중 오류 발생');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('삭제 실패');

      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert('삭제되었습니다.');
    } catch (error) {
      alert('삭제 중 오류 발생');
    }
  };

  if (loading) return <div className="p-10 text-center text-lg font-bold dark:text-white">로딩 중...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 text-black font-sans dark:bg-black dark:text-white">
      <main className="flex w-full max-w-6xl flex-1 flex-col bg-white px-6 py-10 shadow-sm border-x border-zinc-200 dark:bg-black dark:border-zinc-800">

        {/* 상단 바 */}
        <div className="relative mb-8 flex items-center border border-zinc-300 bg-zinc-100 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
          <Link href="/admin/products" className="text-lg font-bold hover:text-blue-600 transition-colors">
            상품관리
          </Link>

          <button
            onClick={() => router.push('/')}
            className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-wide hover:opacity-80"
          >
            Grids & Circles
          </button>

          <Link href="/admin/orders" className="ml-auto text-lg text-zinc-600 hover:text-black dark:hover:text-white transition-colors">
            주문관리
          </Link>
        </div>

        {/* 제목 및 추가 버튼 */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h1 className="text-2xl font-bold text-zinc-800 border-l-4 border-black pl-4 dark:text-white dark:border-white">
            상품 목록
          </h1>

          <button
            onClick={handleAddStart}
            className="px-6 py-2 bg-black text-white font-bold hover:bg-zinc-800 transition-colors shadow-sm dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            상품 추가
          </button>
        </div>

        <div className="overflow-hidden border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-300 bg-zinc-100 text-zinc-700 font-bold dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <th className="p-4 w-16">ID</th>
                <th className="p-4 w-24">이미지</th>
                <th className="p-4">상품명</th>
                <th className="p-4 w-32">가격</th>
                <th className="p-4 w-48 text-center">기능</th>
              </tr>
            </thead>

            <tbody>
              {/* 추가 입력 행 */}
              {isAdding && (
                <tr className="border-b-2 border-blue-400 bg-blue-50 transition-all dark:bg-blue-900/30">
                  <td className="p-4 text-blue-600 font-bold dark:text-blue-400">NEW</td>
                  <td className="p-4">
                    <div className="h-16 w-16 border border-dashed border-blue-300 bg-white flex items-center justify-center text-zinc-400 text-xs text-center dark:bg-zinc-800 dark:border-blue-700">
                      이미지<br />자동설정
                    </div>
                  </td>
                  <td className="p-4">
                    <input
                      className="border border-blue-300 px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-blue-700"
                      placeholder="새 상품명 입력"
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      autoFocus
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      className="border border-blue-300 px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white dark:border-blue-700"
                      placeholder="가격 입력"
                      value={addForm.price || ''}
                      onChange={(e) => setAddForm({ ...addForm, price: Number(e.target.value) })}
                    />
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={handleAddSubmit}
                        className="px-4 py-1.5 bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="px-4 py-1.5 bg-zinc-400 text-white font-bold hover:bg-zinc-500"
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
                  className="border-b border-zinc-200 hover:bg-zinc-50 transition-colors dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                >
                  <td className="p-4 text-zinc-500 dark:text-zinc-400">{product.id}</td>

                  <td className="p-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                      <Image
                        src={productImages[product.id] || "/images/1.png"} 
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </td>

                  <td className="p-4 font-medium">
                    {isEditing === product.id ? (
                      <input
                        className="border border-zinc-300 px-2 py-1 w-full focus:outline-none focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        autoFocus
                      />
                    ) : (
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-semibold text-blue-600 hover:underline decoration-2 underline-offset-4 dark:text-blue-400"
                      >
                        {product.name}
                      </Link>
                    )}
                  </td>

                  <td className="p-4 font-bold text-zinc-800 dark:text-zinc-200">
                    {isEditing === product.id ? (
                      <input
                        type="number"
                        className="border border-zinc-300 px-2 py-1 w-full focus:outline-none focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      />
                    ) : (
                      `${product.price.toLocaleString()}원`
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {isEditing === product.id ? (
                        <button
                          onClick={() => handleModify(product.id)}
                          className="px-4 py-1.5 border border-blue-500 bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
                        >
                          저장
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(product)}
                          className="px-4 py-1.5 border border-zinc-300 bg-zinc-200 hover:bg-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors"
                        >
                          수정
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-4 py-1.5 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400 transition-colors"
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
            <div className="py-24 text-center text-zinc-400 italic font-medium">
              등록된 상품이 없습니다.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}