import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    process.env.CLIENT_ID &&
    process.env.CLIENT_SECRET &&
    process.env.CALLBACK_URL
  ) {
    const client = new TwitterApi({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      process.env.CALLBACK_URL,
      { scope: ["tweet.read", "users.read", "offline.access"] }
    );

    res.setHeader("Set-Cookie", [
      `codeVerifier=${codeVerifier}; HttpOnly`,
      `state=${state}; HttpOnly`,
    ]);

    res.status(200).json({ url });
  } else {
    res.status(500);
  }
}
