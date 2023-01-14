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
        <h2>お店登録</h2>
      </header>

      <main>
        <UpdateCafe
          cafe={cafe}
          setCafe={setCafe}
          cafeStatus={cafeStatus}
          setCafeStatus={setCafeStatus}
        />
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
