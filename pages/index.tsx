import { useState } from "react";
import Head from "next/head";
import { Cafe, CafeInfo, UpdateCafe } from "../components/cafe";
import { CafeStatus, UpdateCafeStatus } from "../components/status";

export default function Home() {
  const [cafe, setCafe] = useState<Cafe>({
    name: "",
    address: "",
    access: "",
    tableNum: 0,
    note: "",
  });

  const [cafeStatus, setCafeStatus] = useState<CafeStatus>({
    tables: [],
    reserved: {
      reservedPersons: {},
    },
  });

  const persons = cafeStatus.reserved.reservedPersons;
  const names = Object.keys(persons);

  return (
    <div>
      <Head>
        <title>お店のリアルタイム座席情報</title>
        <meta name="description" content="お店のリアルタイム座席情報" />
      </Head>

      <header>
        <h2>お店のリアルタイム座席情報</h2>
      </header>

      <main>
        <ul>
          <CafeInfo cafe={cafe} />
          <li>ご利用状況</li>
          <ul>
            <li>座席数: {cafe.tableNum}</li>
            <li>
              空席数:{" "}
              {cafe.tableNum -
                cafeStatus.tables.filter((table) => !table.empty).length}
            </li>
            <li>予約人数: {Object.keys(persons).length}</li>
            <li>
              お待ち時間: 約
              {cafeStatus.reserved.waitingMinutes
                ? cafeStatus.reserved.waitingMinutes
                : 0}
              分
            </li>
            <li>備考: {cafe.note ? cafe.note : "無し"}</li>
            <li>
              <div>
                各テーブル状況
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
                              (new Date().getTime() -
                                table.startTime.getTime()) /
                                (60 * 1000)
                            )
                          ) +
                          "分" +
                          String(
                            Math.round(
                              ((new Date().getTime() -
                                table.startTime.getTime()) /
                                1000) %
                                60
                            )
                          ) +
                          "秒"
                        : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li>予約リスト</li>
            <ul>
              {names.map((name) => (
                <li key={name}>
                  {name + " "}{" "}
                  {persons[name].reservedTime?.toLocaleTimeString()}{" "}
                  {persons[name].enter ? "ご帰宅済み" : ""}
                </li>
              ))}
            </ul>
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
      </main>

      <footer>
        <ul>
          <li>利用規約</li>
          <li>プライバシーポリシー</li>
          <li>お問合せ窓口</li>
        </ul>
      </footer>
    </div>
  );
}
