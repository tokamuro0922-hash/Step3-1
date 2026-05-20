// ======================================================
// app/api/search/route.ts  —  検索APIのスタブ（仮の実装）
// WEEK 8 宿題：このファイルをまるごとコピーして使ってください
//
// 【配置場所】
//   my-app/
//   └── app/
//       └── api/
//           └── search/
//               └── route.ts   ← ここ！
//
// 【役割】
//   ブラウザから /api/search?q=○○ にアクセスすると
//   このファイルが自動的に呼ばれて、JSON を返します。
//   WEEK 9 で FastAPI に繋ぐまでの「仮の受け口」です。
// ======================================================

// NextRequest  = リクエスト（ブラウザからの問い合わせ）を扱う型
// NextResponse = レスポンス（サーバーからの返答）を作る道具
import { NextRequest, NextResponse } from "next/server";

// ======================================================
// GET 関数 — HTTP の GET リクエストを受け取る処理
// Next.js の App Router では、関数名が HTTP メソッド名と一致する
// （GET / POST / PUT / DELETE など）
// ======================================================
export async function GET(request: NextRequest) {

  // URL の ?q=○○ の部分（クエリパラメータ）を取り出す
  // 例: /api/search?q=Tech0 → q = "Tech0"
  // get("q") が null の場合は空文字（""）を使う
  const q = request.nextUrl.searchParams.get("q") ?? "";

  // ======================================================
  // ★ WEEK 9 で、ここを FastAPI への fetch に書き換えます ★
  //
  // 今週（WEEK 8）はスタブ（仮の返答）を返すだけ。
  // 「型（インターフェース）を先に決めておく」ことが目的！
  // フロント（page.tsx）はこの形式のデータが来ることを期待して
  // 動いているので、WEEK 9 に繋ぎ替えても画面は壊れない。
  // ======================================================

  // NextResponse.json() で JSON レスポンスを返す
  return NextResponse.json({
    // 現状を説明するメッセージ（フロントの data.results を見てね）
    message: "未接続です。Week 9で FastAPI と繋ぎます。",

    // 検索キーワードをそのまま返す（デバッグ用）
    query: q,

    // 検索結果：今週はダミーデータを返す
    // WEEK 9 でここが FastAPI からのリアルなデータに変わる
    results: [
      { id: 1, title: `「${q}」のダミー結果①`, url: "https://example.com/1" },
      { id: 2, title: `「${q}」のダミー結果②`, url: "https://example.com/2" },
      { id: 3, title: `「${q}」のダミー結果③`, url: "https://example.com/3" },
    ],
  });
}
