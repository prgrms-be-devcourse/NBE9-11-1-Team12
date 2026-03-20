'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null); // 현재 수정 중인 상품 ID
  const [editForm, setEditForm] = useState({ name: '', price: 0 }); // 폼 데이터

  useEffect(() => {
    fetch('http://localhost:8080/admin/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // ✅ 삭제 기능
  const handleDelete = async (product: Product) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`http://localhost:8080/admin/products/${product.id}`, {
        method: 'DELETE'
      });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (error) { alert('삭제 중 오류 발생'); }
  };

  // ✅ 수정 모드 진입 (이름, 비용만 폼에 세팅)
  const startEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditForm({ name: product.name, price: product.price });
  };

  // ✅ 수정 처리 (백엔드 PUT 요청)
  const handleModify = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm), // 이름과 비용만 보냄
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...editForm } : p))
        );
        setIsEditing(null); // 수정 모드 종료
        alert('수정 완료!');
      }
    } catch (error) { alert('수정 중 오류 발생'); }
  };

  return (
    <>

      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>상품 목록</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
              <td style={{ padding: '12px' }}>
                {isEditing === product.id ? (
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                ) : (product.name)}
              </td>
              <td style={{ padding: '12px' }}>
                {isEditing === product.id ? (
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                  />
                ) : (product.price.toLocaleString() + '원')}
              </td>
              <td style={{ padding: '12px' }}>
                {isEditing === product.id ? (
                  <button onClick={() => handleModify(product.id)} style={{ backgroundColor: '#2196F3', color: 'white', marginRight: '8px' }}>저장</button>
                ) : (
                  <button onClick={() => startEdit(product)} style={{ backgroundColor: '#4CAF50', color: 'white', marginRight: '8px' }}>수정</button>
                )}
                <button onClick={() => handleDelete(product)} style={{ backgroundColor: '#f44336', color: 'white' }}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}