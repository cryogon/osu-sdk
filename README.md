# osu-sdk

A TypeScript/JavaScript SDK for the osu! API v2, providing easy access to osu! game data and statistics.

## Features

- **Type-safe**: Full TypeScript support with comprehensive type definitions
- **Lightweight**: Minimal dependencies for fast performance
- **Modern**: Built with Bun runtime for optimal speed
- **Easy to use**: Simple and intuitive API interface
- **Comprehensive**: Access to all osu! API v2 endpoints

## Installation

### Using Bun (Recommended)
```bash
bun add osu-sdk
```

### Using npm
```bash
npm install osu-sdk
```

### Using yarn
```bash
yarn add osu-sdk
```

## Prerequisites

- **Bun**: This project is optimized for Bun runtime (v1.2.15+)
- **osu! API v2 credentials**: You'll need to register an application at [osu! settings](https://osu.ppy.sh/home/account/edit#oauth)

## Quick Start

### 1. Get your API credentials

1. Go to [osu! account settings](https://osu.ppy.sh/home/account/edit#oauth)
2. Create a new OAuth application
3. Note down your `client_id` and `client_secret`

### 2. Basic usage

```typescript
import { OsuApi } from 'osu-sdk';

// Initialize the SDK
const osu = new OsuApi({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret'
});

// Get user information
const user = await osu.getUser({ userId: 124493 });
console.log(user.username); // Output: user's name

// Get beatmap information
const beatmap = await osu.getBeatmap({ beatmapId: 75 });
console.log(beatmap.title); // Output: beatmap title
```

## API Reference

### Authentication

The SDK handles OAuth2 authentication automatically. You just need to provide your client credentials.

```typescript
const osu = new OsuApi({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  // Optional: specify different scopes
  scopes: ['public']
});
```

### User Methods

#### Get User
```typescript
// Get user by ID
const user = await osu.getUser({ userId: 124493 });

// Get user by username
const user = await osu.getUser({ username: 'peppy' });

// Get user with specific game mode
const user = await osu.getUser({
  userId: 124493,
  mode: 'osu' // 'osu', 'taiko', 'fruits', 'mania'
});
```

#### Get User Scores
```typescript
// Get user's best scores
const bestScores = await osu.getUserScores({
  userId: 124493,
  type: 'best',
  limit: 10
});

// Get user's recent scores
const recentScores = await osu.getUserScores({
  userId: 124493,
  type: 'recent',
  limit: 5
});
```

### Beatmap Methods

#### Get Beatmap
```typescript
// Get beatmap by ID
const beatmap = await osu.getBeatmap({ beatmapId: 75 });

// Get beatmap with difficulty attributes
const beatmapWithDiff = await osu.getBeatmap({
  beatmapId: 75,
  mods: ['HD', 'HR'] // Hard Rock + Hidden
});
```

#### Get Beatmapset
```typescript
// Get complete beatmapset
const beatmapset = await osu.getBeatmapset({ beatmapsetId: 1 });
```

#### Search Beatmaps
```typescript
// Search for beatmaps
const searchResults = await osu.searchBeatmaps({
  query: 'toumei elegy',
  mode: 'osu',
  status: 'ranked'
});
```

### Score Methods

#### Get Beatmap Scores
```typescript
// Get leaderboard for a beatmap
const scores = await osu.getBeatmapScores({
  beatmapId: 75,
  mode: 'osu',
  limit: 10
});
```

### Rankings Methods

#### Get Rankings
```typescript
// Get performance rankings
const rankings = await osu.getRankings({
  mode: 'osu',
  type: 'performance'
});

// Get country rankings
const countryRankings = await osu.getRankings({
  mode: 'osu',
  type: 'performance',
  country: 'US'
});
```

## Development

### Setup
```bash
# Clone the repository
git clone https://github.com/cryogon/osu-sdk.git
cd osu-sdk

# Install dependencies
bun install
```

### Running
```bash
# Run the main file
bun run index.ts

# Run tests (if available)
bun test
```

### Building
```bash
# Build for production
bun run build
```

## Configuration Options

```typescript
interface OsuSDKConfig {
  clientId: string;
  clientSecret: string;
  scopes?: string[];        // Default: ['public']
  baseUrl?: string;         // Default: 'https://osu.ppy.sh/api/v2'
  timeout?: number;         // Request timeout in ms
  retries?: number;         // Number of retry attempts
}
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
try {
  const user = await osu.getUser({ userId: 123456 });
} catch (error) {
  if (error.status === 404) {
    console.log('User not found');
  } else if (error.status === 401) {
    console.log('Authentication failed');
  } else {
    console.log('Other error:', error.message);
  }
}
```

## Rate Limiting

The SDK automatically handles rate limiting according to osu! API guidelines:
- Respects `X-RateLimit-*` headers
- Implements exponential backoff for retries
- Queues requests when rate limit is reached

## TypeScript Support

All API responses are fully typed:

```typescript
import { User, Beatmap, Score } from 'osu-sdk';

const user: User = await osu.getUser({ userId: 124493 });
const beatmap: Beatmap = await osu.getBeatmap({ beatmapId: 75 });
const scores: Score[] = await osu.getUserScores({ userId: 124493, type: 'best' });
```

## Examples

### Get Top Players
```typescript
const topPlayers = await osu.getRankings({
  mode: 'osu',
  type: 'performance',
  cursor: { page: 1 }
});

console.log('Top 50 players:');
topPlayers.ranking.forEach((user, index) => {
  console.log(`${index + 1}. ${user.username} - ${user.statistics.pp}pp`);
});
```

### Compare Users
```typescript
const users = await Promise.all([
  osu.getUser({ username: 'cookiezi' }),
  osu.getUser({ username: 'whitecat' })
]);

users.forEach(user => {
  console.log(`${user.username}: ${user.statistics.pp}pp (#${user.statistics.global_rank})`);
});
```

### Get User's Recent Activity
```typescript
const recentScores = await osu.getUserScores({
  userId: 124493,
  type: 'recent',
  limit: 5,
  include_fails: false
});

recentScores.forEach(score => {
  console.log(`${score.beatmapset.artist} - ${score.beatmapset.title} [${score.beatmap.version}]`);
  console.log(`Accuracy: ${(score.accuracy * 100).toFixed(2)}% | PP: ${score.pp}`);
});
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Requirements

- **Bun** v1.2.15 or higher
- **Node.js** 18+ (if using npm/yarn)
- Valid osu! API v2 credentials

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This is an unofficial SDK and is not affiliated with ppy Pty Ltd or osu!. osu! is a trademark of ppy Pty Ltd.

## Support

- 📖 [osu! API v2 Documentation](https://osu.ppy.sh/docs/index.html)
- 🐛 [Report Issues](https://github.com/cryogon/osu-sdk/issues)
- 💬 [Discussions](https://github.com/cryogon/osu-sdk/discussions)

## Related Projects

- [osu-web.js](https://github.com/L-Mario564/osu.js) - Alternative JavaScript SDK
- [osu!](https://github.com/ppy/osu) - Official osu! client
- [osu-tools](https://github.com/ppy/osu-tools) - Official osu! command line tools
