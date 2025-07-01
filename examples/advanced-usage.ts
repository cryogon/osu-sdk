import OsuApi from "../src/main";

async function advancedExample() {
  const osu = new OsuApi(
    {
      client_id: "your_client_id",
      client_secret: "your_client_secret",
    },
    {
      // Custom API configuration
      timeout: 10000,
      retryAttempts: 5,
      userAgent: "MyApp/1.0",
    }
  );

  await osu.getClientCredentialsToken(["public"]);

  try {
    // Get detailed beatmap information
    const beatmap = await osu.beatmaps.getBeatmap(129891); // Some beatmap ID
    console.log(
      `Beatmap: ${beatmap.version} by ${beatmap.beatmapset?.creator}`
    );

    // Get beatmap scores with filtering
    const scores = await osu.beatmaps.getBeatmapScores(129891, {
      mode: "osu",
      type: "global",
      legacy_only: false,
    });
    console.log(`Top ${scores.scores.length} scores found`);

    // Get user's score on specific beatmap
    try {
      const userScore = await osu.beatmaps.getUserBeatmapScore(129891, 2);
      console.log(
        `User's score: ${userScore.score.score} (${userScore.score.rank})`
      );
    } catch (error) {
      console.log("User has no score on this beatmap");
    }

    // Get current rankings
    const rankings = await osu.rankings.getRankings("osu", "performance", {
      country: "US",
      filter: "all",
    });
    console.log(`Top ${rankings.ranking.length} players in US`);

    // Search with pagination
    let cursor: string | null = null;
    let page = 1;

    do {
      const searchResult = await osu.beatmapsets.searchBeatmapsets({
        query: "anime",
        sort: "ranked_desc",
        cursor_string: cursor,
      });

      console.log(
        `Page ${page}: ${searchResult.beatmapsets.length} beatmapsets`
      );
      cursor = searchResult.cursor_string || "";
      page++;
    } while (cursor && page <= 3); // Limit to 3 pages for example
  } catch (error) {
    console.error("Error in advanced example:", error);
  }
}
