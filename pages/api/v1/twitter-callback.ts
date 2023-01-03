import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import * as cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Extract state and code from query string
  const { state, code } = req.query;
  console.log("test");
  console.log(state, code);
  console.log(cookie.parse(req.headers.cookie ? req.headers.cookie : ""));

  // Get the saved codeVerifier from session
  const parsed = cookie.parse(req.headers.cookie ? req.headers.cookie : "");
  const codeVerifier = parsed["codeVerifier"];
  const sessionState = parsed["state"];

  if (!codeVerifier || !state || !sessionState || !code) {
    res
      .status(400)
      .json({ message: "You denied the app or your session expired!" });
  }
  if (state !== sessionState) {
    res.status(400).json({ message: "Stored tokens didn't match!" });
  }

  // Obtain access token
  if (
    process.env.CLIENT_ID &&
    process.env.CLIENT_SECRET &&
    process.env.HOST &&
    typeof code === "string" &&
    codeVerifier
  ) {
    const client = new TwitterApi({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: `${process.env.HOST}/api/v1/twitter-callback`,
    });

    const loggedInfo = await loggedClient.v2.me();
    console.log(loggedInfo);
    res.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; HttpOnly`,
      `refreshToken=${refreshToken}; HttpOnly`,
      `expiresIn=${expiresIn};`,
    ]);

    process.env.HOST ? res.redirect(process.env.HOST) : "";
  }
}
