"use client";

import { useCallback, useState, type FormEvent } from "react";

export default function ProductManagement() {
  type Product = { id: number; name: string; price: number };

  // CORS에서 localhost:3000 허용이 있으니 프론트는 3000 사용.
  const API_BASE_URL = "http://localhost:8080";

  const [products, setProducts] = useState<Product[]>([]);

  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setMode(null);
    setSelectedId(null);
    setName("");
    setPrice("");
    setError(null);
  }, []);

  const openCreateForm = useCallback(() => {
    setMode("create");
    setSelectedId(null);
    setName("");
    setPrice("");
    setError(null);
  }, []);

  const openEditForm = useCallback((product: Product) => {
    setMode("edit");
    setSelectedId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setError(null);
  }, []);

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!mode) return;

      setIsSubmitting(true);
      setError(null);
      try {
        const body = {
          name: name.trim(),
          price: Number(price),
        };

        if (!body.name) throw new Error("상품 이름을 입력해주세요.");
        if (!Number.isFinite(body.price) || body.price < 0)
          throw new Error("가격은 0 이상의 숫자여야 합니다.");

        if (mode === "create") {
          const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error(`등록 실패: ${res.status}`);

          const json = await res.json();
          const created: Product = json?.data;
          setProducts((prev) => [...prev, created]);
          resetForm();
          return;
        }

        if (mode === "edit" && selectedId != null) {
          const res = await fetch(
            `${API_BASE_URL}/api/admin/products/${selectedId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );
          if (!res.ok) throw new Error(`수정 실패: ${res.status}`);

          const json = await res.json();
          const updated: Product = json?.data;
          setProducts((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          );
          resetForm();
          return;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "알 수 없는 오류";
        setError(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [API_BASE_URL, mode, name, price, resetForm, selectedId]
  );

  const deleteProduct = useCallback(async (product: Product) => {
    // 요구사항: 버튼 누르면 바로 UI에서 사라지게(낙관적 업데이트).
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/products/${product.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      setProducts((prev) => [...prev, product]);
      setError(msg);
    }
  }, []);

  return (
    <div style={{ border: "2px solid blue", padding: 20, margin: 16 }}>
      <h3 style={{ marginBottom: 12 }}>상품 관리</h3>

      <div style={{ marginBottom: 12 }}>
        <button onClick={openCreateForm}>상품 등록</button>
      </div>

      {error ? (
        <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
      ) : null}

      {products.length === 0 ? (
        <div style={{ marginBottom: 16, color: "#666" }}>
          아직 등록된 상품이 없습니다. 위에서 `상품 등록`을 눌러 주세요.
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>
                {p.name} (ID: {p.id})
              </div>
              <div style={{ color: "#666" }}>가격: {p.price}</div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => openEditForm(p)}>수정</button>
              <button
                onClick={() => deleteProduct(p)}
                style={{ color: "red" }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {mode ? (
        <form
          onSubmit={submit}
          style={{
            marginTop: 16,
            borderTop: "1px solid #ddd",
            paddingTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {mode === "create" ? "상품 등록 폼" : `상품 수정 폼 (ID: ${selectedId})`}
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            상품 이름
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            가격
            <input
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "처리중..."
                : mode === "create"
                  ? "등록"
                  : "수정"}
            </button>
            <button type="button" onClick={resetForm} disabled={isSubmitting}>
              취소
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

