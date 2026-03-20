export function fetchApi(url: string, options?: RequestInit) {

    if (options?.body) {
        const headers = new Headers(options.headers || {});
        headers.set("Content-Type", "application/json");
        options.headers = headers;
    }


    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

    return fetch(`${baseUrl}${url}`, options).then(
        async (res) => {
            if (!res.ok) {
                const rsData = await res.json().catch(() => ({}));
                throw new Error(rsData.msg || "요청 실패");
            }
            // 성공 시 JSON 데이터 반환
            return res.json();
        }
    );
}