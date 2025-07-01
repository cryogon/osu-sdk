import OsuApi from "../src/main";

async function basicExample() {
  // Initialize the SDK with your OAuth application credentials
  const osu = new OsuApi({
    client_id: "your_client_id",
    client_secret: "your_client_secret",
    redirect_uri: "http://localhost:3000/callback",
  });

  try {
    // Method 1: Using Client Credentials (for public data access)
    await osu.getClientCredentialsToken(["public"]);

    // Method 2: Using API key directly (if you have one)
    // osu.setAccessToken('your_api_key');

    // Method 3: OAuth authorization flow (for user data access)
    // const authUrl = osu.getAuthorizationUrl(['public', 'identify']);
    // console.log('Visit this URL to authorize:', authUrl);
    // After user authorizes and you get the code:
    // await osu.exchangeCodeForToken('authorization_code');

    // Now you can use the API
    console.log("Authentication successful!");

    // Get user information
    const user = await osu.users.getUser("cryogon", { key: "username" }); // peppy
    console.log(`User: ${user.username} (${user.country_code})`);
    console.log("THE:", user);

    // Get user's best scores
    const bestScores = await osu.users.getUserScores(2, {
      type: "best",
      limit: 5,
    });
    console.log(`Best scores: ${bestScores.length} found`);

    // Search for beatmapsets
    const search = await osu.beatmapsets.searchBeatmapsets({
      query: "freedom dive",
      mode: "osu",
      status: "ranked",
    });
    console.log(`Found ${search.beatmapsets.length} beatmapsets`);
  } catch (error) {
    console.error("Error:", error);
  }
}

basicExample();
