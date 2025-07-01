import express from "express";
import OsuApi from "../src/main";

const app = express();
const port = 3000;

const osu = new OsuApi({
  client_id: "your_client_id",
  client_secret: "your_client_secret",
  redirect_uri: `http://localhost:${port}/callback`,
});

// Step 1: Redirect user to authorization
app.get("/auth", (req, res) => {
  const authUrl = osu.getAuthorizationUrl(
    ["public", "identify"],
    "random_state"
  );
  res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code for token
app.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).send("No authorization code received");
    }

    // Exchange code for access token
    const tokenInfo = await osu.exchangeCodeForToken(code as string);
    console.log("Token obtained:", tokenInfo);

    // Now you can access user data
    const user = await osu.users.getMe();
    res.json({
      message: "Authentication successful!",
      user: {
        id: user.id,
        username: user.username,
        country: user.country_code,
      },
    });
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).send("Authentication failed");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Visit http://localhost:${port}/auth to start OAuth flow`);
});
