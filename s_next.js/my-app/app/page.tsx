// ======================================================
// app/page.tsx  —  Tech0 Search 検索画面
// WEEK 8 宿題：このファイルをまるごとコピーして使ってください
// ======================================================

// 【ポイント①】"use client" — このファイルはブラウザで動くよ、という合図
// Next.js はデフォルトでサーバー側で動くので、
// ボタンクリックや useState を使う画面には必ずこの1行が必要！
"use client";

// 【ポイント②】useState を React から借りてくる
// useState = 「画面の状態（データ）を覚えておく特別な箱」
import { useState } from "react";

// ======================================================
// 型定義：検索結果 1件のデータの「形」を決めておく
// TypeScript では、データの形を先に決めると安全に書ける
// ======================================================
type SearchResult = {
  id: number;    // 結果を区別するための番号
  title: string; // 検索結果のタイトル
  url: string;   // リンク先のURL
};

// ======================================================
// SearchPage コンポーネント（＝このページの設計図）
// export default = 「このファイルのメイン部品」として外に公開
// ======================================================
export default function SearchPage() {

  // ---- useState で「状態の箱」を3つ用意 ----

  // query    : 検索ボックスに入力された文字を覚えておく箱（初期値は空文字）
  const [query, setQuery] = useState("");

  // results  : 検索結果の一覧を覚えておく箱（初期値は空の配列）
  // <SearchResult[]> は「SearchResult 型のデータが複数入る」という意味
  const [results, setResults] = useState<SearchResult[]>([]);

  // loading  : 今検索中かどうかを覚えておく箱（true=検索中 / false=待機中）
  const [loading, setLoading] = useState(false);

  // ======================================================
  // handleSearch 関数 — 検索ボタンを押したときに動く処理
  // async = 「少し時間がかかる処理をする」という印
  // ======================================================
  const handleSearch = async () => {

    // 検索開始 → ローディング状態をONにする（ボタンが「検索中...」になる）
    setLoading(true);

    try {
      // 【fetch】= Next.js の API ルートに「検索してください」とリクエストを送る
      // /api/search?q=○○ → app/api/search/route.ts が受け取る
      // encodeURIComponent = 日本語などの特殊文字をURLで使える形に変換
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

      // 受け取ったレスポンスを JSON 形式（JavaScript のオブジェクト）に変換
      const data = await res.json();

      // 取得した results を状態の箱に入れる → 画面が自動的に更新される！
      // data.results がなければ空配列（[]）をセット（エラー防止）
      setResults(data.results ?? []);

    } finally {
      // 成功・失敗どちらの場合もローディング状態をOFFにする
      setLoading(false);
    }
  };

  // ======================================================
  // return — ブラウザに表示する画面の設計図（JSX）
  // HTML に似た書き方で、React のコンポーネントを組み合わせる
  // ======================================================
  return (
    <main>
      {/* ページタイトル */}
      <h1>Tech0 Search</h1>

      {/*
        検索ボックス
        - value={query}        : 箱の中身を表示する
        - onChange={...}       : 文字を入力するたびに箱を更新する
        - onKeyDown={...}      : Enter キーを押しても検索できるようにする
      */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="キーワードを入力..."
      />

      {/*
        検索ボタン
        - onClick={handleSearch} : クリックで handleSearch 関数を呼ぶ
        - loading が true のときは「検索中...」と表示して操作を待たせる
      */}
      <button onClick={handleSearch}>
        {loading ? "検索中..." : "検索"}
      </button>

      {/*
        検索結果一覧
        - results.map(...) : results 配列の各要素を <li> に変換して表示
        - key={r.id}       : React がリストを効率よく管理するための識別子（必須）
      */}
      <ul>
        {results.map((r) => (
          <li key={r.id}>
            <a href={r.url}>{r.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
