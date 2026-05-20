"use client";

import { useState } from "react";

type SearchResult = {
  id: number;
  title: string;
  url: string;
  description?: string;
  category?: string;
  file_type?: string;
  word_count?: number;
  crawled_at?: string;
  relevance_score?: number;
  view_count?: number;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://tech0-search-api-okamu-ezhnb8fefddrd2fc.southeastasia-01.azurewebsites.net/api/search?q=${encodeURIComponent(query)}`
      );

      const data = await res.json();
      setResults(data.results ?? []);
    } catch (error) {
      console.error("検索エラー:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        color: "#0f172a",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          minHeight: "100vh",
        }}
      >
        <aside
          style={{
            background: "#ffffff",
            borderRight: "1px solid #e2e8f0",
            padding: "28px 20px",
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>
            🔍 Tech0 Search
          </h2>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ color: "#64748b", fontSize: "13px" }}>
              検索結果数
            </div>
            <div style={{ fontSize: "28px", fontWeight: 700 }}>
              {results.length} 件
            </div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "16px",
            }}
          >
            <h3 style={{ fontSize: "15px", marginBottom: "12px" }}>
              🔎 フィルター
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b" }}>
              今回は検索API接続を優先しています。
              カテゴリ・日付・ファイル種別フィルターは次の拡張で追加できます。
            </p>
          </div>
        </aside>

        <section style={{ padding: "36px" }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "36px", marginBottom: "6px" }}>
              🔍 Tech0 Search
            </h1>

            <p style={{ color: "#64748b", marginBottom: "28px" }}>
              社内ナレッジ・資料を全文検索できるアプリ
            </p>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                marginBottom: "28px",
              }}
            >
              <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>
                全文検索
              </h2>

              <div style={{ display: "flex", gap: "12px" }}>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="例: DX / 提案 / 不具合 / 会議 / 売上"
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "12px",
                    fontSize: "16px",
                  }}
                />

                <button
                  onClick={handleSearch}
                  disabled={loading}
                  style={{
                    padding: "14px 26px",
                    background: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "検索中..." : "検索"}
                </button>
              </div>
            </div>

            {query && (
              <h2 style={{ fontSize: "22px", marginBottom: "18px" }}>
                検索結果: {results.length} 件
              </h2>
            )}

            {!query && (
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#1e40af",
                  borderRadius: "14px",
                  padding: "18px",
                }}
              >
                検索キーワードを入力してください。
              </div>
            )}

            {query && results.length === 0 && !loading && (
              <div
                style={{
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  color: "#9a3412",
                  borderRadius: "14px",
                  padding: "18px",
                }}
              >
                該当する検索結果はありません。
              </div>
            )}

            {results.map((r, index) => (
              <article
                key={r.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "24px",
                  marginBottom: "18px",
                  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>
                      {index + 1}. {r.title}
                    </h3>

                    <div style={{ color: "#64748b", fontSize: "14px" }}>
                      📄 {r.file_type ?? "ファイル種別不明"}
                    </div>
                  </div>

                  <div style={{ textAlign: "right", minWidth: "90px" }}>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>
                      Score
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: 700 }}>
                      {r.relevance_score ?? "-"}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>
                      👀 {r.view_count ?? 0} views
                    </div>
                  </div>
                </div>

                {r.description && (
                  <p style={{ marginTop: "14px", color: "#334155" }}>
                    {r.description}
                  </p>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "10px",
                    marginTop: "18px",
                    fontSize: "13px",
                    color: "#475569",
                  }}
                >
                  <div>📁 {r.category ?? "未設定"}</div>
                  <div>📊 {r.word_count ?? 0} 語</div>
                  <div>📂 {r.url}</div>
                  <div>🕒 {r.crawled_at ?? "不明"}</div>
                </div>

                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "18px",
                    color: "#2563eb",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  ファイルを開く →
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
