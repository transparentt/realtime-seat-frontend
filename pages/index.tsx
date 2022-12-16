import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>お店のリアルタイム座席情報</title>
        <meta name="description" content="お店のリアルタイム座席情報" />
      </Head>

      <header>
        <h1>
          お店のリアルタイム座席情報
        </h1>
      </header>

      <main> 
        <ul>
          <li>店名: メイド喫茶Charlotte</li>
          <li>住所: 東京都大田区西蒲田7丁目61-1 東京蒲田文化会館 3F</li>
          <li>アクセス: JR蒲田駅・東急蒲田駅より徒歩5分</li>
          <li>座席状況</li>
          <ul>
            <li>席数: 12</li>
            <li>空席数: 5</li>
            <li>予約人数: 0</li>
            <li>待ち時間: 約0分</li>
            <li>備考: 満席時は90分制</li>
            <li>テーブル状況</li>
            <ul>
              <li>No.1: 着席 17:05 滞在時間 115分</li>
              <li>No.2: 着席 17:15 滞在時間 105分</li>
              <li>No.3: 空席</li>
              <li>No.4: 空席</li>
              <li>No.5: 着席 17:35 滞在時間 85分</li>
              <li>No.6: 着席 17:45 滞在時間 75分</li>
              <li>No.7: 着席 17:50 滞在時間 70分</li>
              <li>No.8: 着席 17:55 滞在時間 65分</li>
              <li>No.9: 着席 18:00 滞在時間 60分</li>
              <li>No.10: 着席 18:30 滞在時間 30分</li>
              <li>No.11: 空席</li>
              <li>No.12: 着席 19:00 滞在時間 0分</li>
            </ul>
            <li>テーブル更新</li>
            <ul>
              <li>
                席名
                <select name="席名">
                  <option value="No.1">No.1</option>
                  <option value="No.2">No.2</option>
                  <option value="No.3">No.3</option>
                  <option value="No.4">No.4</option>
                  <option value="No.5">No.5</option>
                  <option value="No.6">No.6</option>
                  <option value="No.7">No.7</option>
                  <option value="No.8">No.8</option>
                  <option value="No.9">No.9</option>
                  <option value="No.10">No.10</option>
                  <option value="No.11">No.11</option>
                  <option value="No.12">No.12</option>
                </select>
                  
                <label>
                <input type="radio" name="name" />
                空席
                </label>

                <label>
                <input type="radio" name="name" />
                着席　
                </label>

                <label>
                  時間
                </label>
                
                <input type="text" maxlength="5" size="4"></input>
                <button type="submit">更新</button>
              </li>
              <li>
                席数　<input type="text" maxlength="100" size="3"></input>
                <button type="submit">更新</button>
              </li>
              <li>
                予約人数　<input type="text" maxlength="100" size="3"></input>
                <button type="submit">更新</button>
              </li>
            </ul>
            <li>ご帰宅状況
                <select name="間隔">
                  <option value="日">日</option>
                  <option value="週">週</option>
                  <option value="月">月</option>
                  <option value="年">年</option>
                </select></li>
          </ul>
        </ul>
      </main>

      <footer>
        <ul>
          <li>お問合せ窓口</li>
          <li>利用規約</li>
          <li>基本規約</li>
          <li>プライバシーポリシー</li>
        </ul>
      </footer>
    </div>
  )
}
