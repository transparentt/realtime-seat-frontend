import { useState, createContext, useEffect } from "react";
import Head from "next/head";
import { Cafe, CafeInfo, UpdateCafe } from "../components/cafe";
import { CafeStatus, UpdateCafeStatus } from "../components/status";

export default function Home() {
  const [cafe, setCafe] = useState<Cafe>({
    name: "メイド喫茶Charlotte",
    address: "東京都大田区西蒲田7丁目61-1 東京蒲田文化会館 3F",
    access: "JR蒲田駅・東急蒲田駅より徒歩5分",
    tableNum: 3,
    note: "満席時は90分制",
  });

  const [cafeStatus, setCafeStatus] = useState<CafeStatus>({
    tables: [],
    reserved: {
      reservedPersons: [],
    },
  });

  return (
    <div>
      <Head>
        <title>お店のリアルタイム座席情報</title>
        <meta name="description" content="お店のリアルタイム座席情報" />
      </Head>

      <header>
        <h1>お店のリアルタイム座席情報</h1>
      </header>

      <main>
        <ul>
          <CafeInfo cafe={cafe} />
          <li>座席状況</li>
          <ul>
            <li>座席数: {cafe.tableNum}</li>
            <li>
              空席数:{" "}
              {cafe.tableNum -
                cafeStatus.tables.filter((table) => !table.empty).length}
            </li>
            <li>予約人数: {cafeStatus.reserved.reservedPersons.length}</li>
            <li>
              待ち時間: 約
              {cafeStatus.reserved.waitingMinutes
                ? cafeStatus.reserved.waitingMinutes
                : 0}
              分
            </li>
            <li>備考: {cafe.note ? cafe.note : "無し"}</li>
            <li>各テーブル状況</li>
            <ul>
              {cafeStatus.tables.map((table) => (
                <li key={table.tableName}>
                  {table.tableName}{" "}
                  {table.empty
                    ? "空席"
                    : table.startTime
                    ? "着席 滞在時間:" +
                      String(
                        Math.round(
                          (new Date().getTime() - table.startTime.getTime()) /
                            (60 * 1000)
                        )
                      ) +
                      "分" +
                      String(
                        Math.round(
                          ((new Date().getTime() - table.startTime.getTime()) /
                            1000) %
                            60
                        )
                      ) +
                      "秒"
                    : ""}
                </li>
              ))}
            </ul>
            <li>予約リスト</li>
            <ul>
              {cafeStatus.reserved.reservedPersons.map((person) => (
                <li>
                  {person.name} {person.reservedTime.toLocaleString()}
                </li>
              ))}
            </ul>

            <UpdateCafe
              cafe={cafe}
              setCafe={setCafe}
              cafeStatus={cafeStatus}
              setCafeStatus={setCafeStatus}
            />

            <UpdateCafeStatus
              cafeStatus={cafeStatus}
              setCafeStatus={setCafeStatus}
            />
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
  );
}
