import Head from "next/head";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { SignInWithTwitter } from "../components/login";

export default function Home() {
  const queryClient = new QueryClient();
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
        <QueryClientProvider client={queryClient}>
          <SignInWithTwitter />
        </QueryClientProvider>
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
