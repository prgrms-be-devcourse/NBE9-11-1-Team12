'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:8080/admin/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // ✅ 삭제 기능
  const handleDelete = async (product: Product) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(
        `http://localhost:8080/admin/products/${product.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: product.id,
          }),
        }
      );

      if (!res.ok) throw new Error('삭제 실패');

      // 화면에서 제거
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (error) {
      alert('삭제 중 오류 발생');
      console.error(error);
    }
  };

  // ✅ 수정 이동
  const handleUpdate = (id: number) => {
    router.push(`/admin/products/${id}`);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* 네비게이션 */}
      <nav style={{ marginBottom: '30px', fontSize: '18px' }}>
        <Link href="/admin/products" style={{ marginRight: '20px', fontWeight: 'bold' }}>
          상품
        </Link>
        <Link href="/admin/orders">주문</Link>
      </nav>

      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        상품 목록
      </h1>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>상품명</th>
            <th style={{ padding: '12px' }}>가격</th>
            <th style={{ padding: '12px' }}>기능</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{product.id}</td>
              <td style={{ padding: '12px' }}>{product.name}</td>
              <td style={{ padding: '12px' }}>
                {product.price.toLocaleString()}원
              </td>
              <td style={{ padding: '12px' }}>
                
                {/* ✅ 수정 버튼 */}
                <button
                  onClick={() => handleUpdate(product.id)}
                  style={{
                    padding: '6px 12px',
                    marginRight: '8px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  수정
                </button>

                {/* ✅ 삭제 버튼 */}
                <button
                  onClick={() => handleDelete(product)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  삭제
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}