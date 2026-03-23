'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type ProductDetail = {
  id: number;
  name: string;
  price: number;
  createDate: string; // 백엔드 DTO 필드명에 맞춰 'createDate'로 작성 (기존 코드 기준)
  modifiedDate: string;
};

export default function ProductDetailPage() {
  const params = useParams(); // URL에서 id 추출
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:8080/admin/products/${params.id}`)
        .then((res) => {
          if (!res.ok) throw new Error('상품을 찾을 수 없습니다.');
          return res.json();
        })
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

  if (loading) return <div style={{ padding: '40px' }}>로딩 중...</div>;
  if (!product) return null;

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>상품 상세 정보</h1>
      
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', lineHeight: '2' }}>
        <p><strong>ID:</strong> {product.id}</p>
        <p><strong>상품명:</strong> {product.name}</p>
        <p><strong>가격:</strong> {product.price.toLocaleString()}원</p>
        <p><strong>등록일:</strong> {new Date(product.createDate).toLocaleString()}</p>
        <p><strong>수정일:</strong> {new Date(product.modifiedDate).toLocaleString()}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/admin/products">
          <button style={{ padding: '10px 20px', cursor: 'pointer' }}>목록으로 돌아가기</button>
        </Link>
      </div>
    </div>
  );
}