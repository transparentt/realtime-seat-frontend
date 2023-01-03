import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

const SignInWithTwitter: React.FC = () => {
  const queryClient = useQueryClient();
  const { isLoading, isError, data, error } = useQuery(
    ["signInWithTwitter"],
    async () => {
      return axios
        .get<{ url: string }>(
          "https://c5c3-2409-10-2b00-4600-da07-00-1001.jp.ngrok.io/api/v1/twitter-link"
        )
        .catch((response) => {
          response.data;
        });
    }
  );
  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error has occurred</div>;

  return (
    <Link href={data ? data.data.url : ""}>
      <Image
        src="/sign-in-with-twitter_waifu2x_art_noise1_scale.png"
        alt="Sign in with Twitter"
        width={158}
        height={28}
      ></Image>
    </Link>
  );
};

export { SignInWithTwitter };
