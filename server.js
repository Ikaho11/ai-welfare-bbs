const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// フォームのデータを受け取るための設定
app.use(express.urlencoded({ extended: true }));

// ビューエンジンにEJSっぽい簡易的なHTMLレンダリングを使用
app.set('view engine', 'ejs');

// データベースの代わりの配列（初期データ）
let ideas = [
  { id: 1, title: "AIによる認知特性の早期発見", content: "子どもの遊びの中での行動データをAIが分析し、見えにくい生きづらさを早期に発見して適切なサポートに繋げるアイデアです。" },
  { id: 2, title: "福祉職員向け・対話型ケースワークアシスタント", content: "多忙な児童福祉司の書類作成や過去の事例照会をサポートする、現場特化型のAI相談相手です。" }
];

// 1. トップページ（投稿一覧表示）
app.get('/', (req, res) => {
  let html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>AI×児童福祉 未来アイデアバンク</title>
     // server.js のCSS部分を以下のコードで全て書き換える

    <style>
      /* 1. 全体の設定（優しさと未来感のベース） */
      /* フォントを柔らかく、背景を非常に薄いグレー（クリーンな未来感）に */
      body { 
        font-family: 'Noto Sans JP', sans-serif; 
        background: #f0f4f8; /* 非常に薄い青みのあるグレー */
        color: #334155; /* 濃すぎないグレー */
        max-width: 850px; 
        margin: 0 auto; 
        padding: 30px; 
        line-height: 1.6;
      }
      
      /* 2. タイトル（未来×優しさの融合） */
      /* 色を濃い目の青（知性・未来）にし、中央揃え。下線をパステルグリーン（成長・優しさ）に */
      h1 { 
        color: #0c4a6e; /* 濃い目の青 */
        text-align: center; 
        margin-bottom: 10px;
        position: relative;
        display: inline-block;
        left: 50%;
        transform: translateX(-50%);
      }
      h1::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(to right, #38bdf8, #a3e635); /* 水色からパステルグリーンのグラデーション（融合） */
        border-radius: 2px;
      }
      
      /* タイトル下の説明文を中央揃えに */
      p { text-align: center; color: #64748b; margin-bottom: 40px; }

     /* 3. カード（フォームと投稿一覧）のデザイン */
      .form-box, .card { 
        background: white; 
        padding: 25px; 
        border-radius: 20px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.03);
        margin-bottom: 30px; 
        border: 1px solid #e2e8f0;
        position: relative; /* ← ここを追加！ */
      }

      /* 4. 入力フォームのデザイン */
      .form-group { margin-bottom: 20px; }
      label { 
        display: block; 
        font-weight: bold; 
        margin-bottom: 8px; 
        color: #0c4a6e; /* 濃い目の青 */
      }
      input[type="text"], textarea { 
        width: 100%; 
        padding: 12px; 
        box-sizing: border-box; 
        border: 1px solid #e2e8f0; 
        border-radius: 10px; 
        background: #f8fafc; /* 薄いグレーの背景 */
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      /* 入力中の枠線の色を水色に（未来感） */
      input[type="text"]:focus, textarea:focus {
        outline: none;
        border-color: #38bdf8;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
      }
      
      /* 5. ボタンのデザイン（アクセント・未来感） */
      /* 色を鮮やかな水色（未来）に、角を丸く、ホバー時の動きを滑らかに */
      button { 
        background: #0ea5e9; /* 鮮やかな水色 */
        color: white; 
        border: none; 
        padding: 14px 25px; 
        border-radius: 12px; 
        cursor: pointer; 
        font-size: 16px; 
        font-weight: bold;
        transition: background 0.3s, transform 0.1s; 
        width: 100%; 
        letter-spacing: 1px;
      }
      button:hover { 
        background: #0284c7; /* 濃い目の水色 */
        transform: translateY(-1px); /* 少し上に浮かせる（未来感） */
      }
      button:active {
        transform: translateY(1px); /* クリック感を出す */
      }
      
      /* 6. 提案例一覧のデザイン */
      h2 { color: #0c4a6e; margin-bottom: 20px; padding-left: 10px; border-left: 4px solid #38bdf8; }

      /* 提案例のタイトルを濃い目のグリーン（成長・優しさ）に */
      .card h3 { 
        margin-top: 0; 
        color: #166534; /* 濃い目のグリーン */
        font-size: 1.25rem;
        margin-bottom: 15px;
      }
      
      /* 7. 削除ボタンのデザイン（優しさを持たせる） */
      /* 色を柔らかいパステルレッドに、角を丸く、ホバー時の動きを追加 */
      .delete-btn { 
        background: #fecaca; /* 柔らかい赤 */
        color: #991b1b; /* 濃い目の赤 */
        padding: 8px 16px; 
        text-decoration: none; 
        border-radius: 8px; 
        font-size: 12px; 
        font-weight: bold;
        position: absolute; 
        top: 25px; 
        right: 25px; 
        transition: background 0.3s, color 0.3s; 
      }
      .delete-btn:hover { 
        background: #fca5a5; /* 少し濃い赤 */
        color: #7f1d1d;
      }
    </style>
    </head>
    <body>
      <h1>💡 AI×児童福祉 未来アイデアバンク</h1>
      <p>子どもたちの未来や児童福祉の現場をAIで豊かにするアイデアを共有しよう！</p>
      
      <div class="form-box">
        <h3>新規アイデア投稿</h3>
        <form action="/add" method="POST">
          <div class="form-group">
            <label>アイデア名・タイトル</label>
            <input type="text" name="title" required placeholder="例：AIを活用した学習支援システム">
          </div>
          <div class="form-group">
            <label>提案内容・詳細</label>
            <textarea name="content" rows="4" required placeholder="具体的な仕組みや、どう児童福祉に貢献できるかを書いてください"></textarea>
          </div>
          <button type="submit">アイデアを投稿する</button>
        </form>
      </div>

      <h2>提案例一覧</h2>
  `;

  ideas.forEach(idea => {
    html += `
      <div class="card">
        <h3>${idea.title}</h3>
        <p>${idea.content.replace(/\n/g, '<br>')}</p>
        <a href="/delete/${idea.id}" class="delete-btn">削除</a>
      </div>
    `;
  });

  html += `
    </body>
    </html>
  `;
  res.send(html);
});

// 2. 投稿追加の処理 (Create)
app.post('/add', (req, res) => {
  const newIdea = {
    id: Date.now(), // 簡易的なユニークID
    title: req.body.title,
    content: req.body.content
  };
  ideas.unshift(newIdea); // 先頭に追加
  res.redirect('/');
});

// 3. 投稿削除の処理 (Delete)
app.get('/delete/:id', (req, res) => {
  const targetId = parseInt(req.params.id);
  ideas = ideas.filter(idea => idea.id !== targetId);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});