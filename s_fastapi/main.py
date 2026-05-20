# ======================================================
# main.py  —  Tech0 Search バックエンド API
# WEEK 9 宿題 Step1：まずはFastAPI単体で動かしてみよう！
#
# 【このステップのゴール】
#   ブラウザで http://localhost:8000/api/search?q=Tech0
#   にアクセスして、検索結果のJSONが返ってくることを確認する。
#
# 【起動手順】
#   cd s_fastapi
#   python -m venv .backend
#   . .backend/bin/activate        # Windowsの人は .backend\Scripts\activate
#   pip install fastapi uvicorn
#   uvicorn main:app --reload --port 8000
#
# 【動作確認】
#   ブラウザで以下のURLを開いてみよう：
#   http://localhost:8000/              → サーバー起動確認
#   http://localhost:8000/api/search?q=Tech0  → 検索テスト
#   http://localhost:8000/docs          → Swagger UI（自動生成API仕様書）
# ======================================================

# ======================================================
# 【ポイント①】必要な道具を借りてくる（インポート）
#
# FastAPI : Webサーバーを作るためのフレームワーク
# Query   : URLパラメータ（?q=○○）を受け取るための道具
# sqlite3 : Python標準のSQLiteデータベース操作ライブラリ
#
# ★ CORS設定はまだここには書かない。
#   動作確認ができたら、次のステップで追加する。
# ======================================================
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3


# ======================================================
# 【ポイント②】FastAPIアプリ本体を作成
#
# app = FastAPI() で「レストランをオープン」するイメージ。
# ここから先、@app.get(...) でエンドポイントを追加していく。
# ======================================================
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.jsのポート
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# ======================================================
# 【ポイント③】DB検索関数
#
# search_pages(keyword) はデータベースを検索して結果を返す専用関数。
# エンドポイントと分けて書くことで、ロジックを再利用しやすくする。
#
# LIKE検索：SQL の LIKE ? に % を付けることで「部分一致」を実現
#   f"%{keyword}%" → 「○○を含む」という意味
#   例: keyword="Tech0" → WHERE title LIKE "%Tech0%"
#
# row_factory を設定すると、クエリ結果を辞書形式で取得できる。
# これがないと row[0], row[1] のように列番号でアクセスする必要がある。
#
# ? はプレースホルダー。SQLインジェクション対策として
# 文字列を直接埋め込まず、タプルで渡すのがベストプラクティス。
# ======================================================
def search_pages(keyword: str) -> list[dict]:
    conn = sqlite3.connect("tech0_search.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(
        "SELECT id, title, url FROM pages WHERE title LIKE ? OR url LIKE ?",
        (f"%{keyword}%", f"%{keyword}%")
    )
    results = [dict(row) for row in cur.fetchall()]
    conn.close()
    return results


# ======================================================
# 【ポイント④】ヘルスチェックエンドポイント
#
# GET / にアクセスしてサーバーが起動しているか確認できる。
# まずここが動くことを確認しよう！
# ======================================================
@app.get("/")
def read_root():
    return {"message": "Tech0 Search API is running!", "version": "week9"}


# ======================================================
# 【ポイント⑤】検索エンドポイント
#
# @app.get("/api/search") で GET /api/search を定義。
#
# q: str = Query(default="")
#   → URL の ?q=○○ を受け取る。省略された場合は "" を使う。
#   例: GET /api/search?q=Tech0 → q = "Tech0"
#
# レスポンスの形式（フロントと事前に決めた「型の契約」）:
#   {
#     "results": [ { "id": 1, "title": "...", "url": "..." }, ... ],
#     "total":   件数,
#     "query":   "検索キーワード"
#   }
#
# ★ 今はブラウザで直接 /api/search?q=○○ にアクセスして確認する。
#   Next.js からの接続は、次のステップ（CORS設定追加後）に行う。
# ======================================================
@app.get("/api/search")
def search(q: str = Query(default="")):
    if not q:
        return {"results": [], "total": 0, "query": q}
    results = search_pages(q)
    return {"results": results, "total": len(results), "query": q}


# ======================================================
# 【次のステップ（CORS設定）予告】
#
# このmain.pyが動いたら、次はNext.jsと繋ぐ。
# そのためには以下の2行をインポートに追加して…
#
#   from fastapi.middleware.cors import CORSMiddleware
#
# …さらに app = FastAPI() の直後に以下を追加する：
#
#   app.add_middleware(
#       CORSMiddleware,
#       allow_origins=["http://localhost:3000"],  # Next.jsのポート
#       allow_methods=["GET", "POST", "PUT", "DELETE"],
#       allow_headers=["*"],
#   )
#
# なぜこの設定が必要か？
#   ブラウザには「別のポートへのリクエストは危険かも」という
#   安全機能（CORS）がある。
#   localhost:3000（Next.js）→ localhost:8000（FastAPI）は
#   「ポートが違う = 別のオリジン」と判断されてブロックされる。
#   このミドルウェアで「:3000からのリクエストはOK！」と許可する。
# ======================================================
