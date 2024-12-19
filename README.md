# Kleros Curate CDNQ

## Overview

The Kleros Curate CDNQ module provides a service for fetching and managing decentralized content delivery network (CDN) entries from various blockchain subgraphs. It allows users to retrieve metadata about registries, including contract addresses and associated visual proofs.

## Features

- Fetches data from multiple subgraphs based on the specified chain ID.
- Handles GraphQL queries to retrieve registry metadata.
- Provides error handling for API responses and data integrity.
- Supports integration with the Kleros ecosystem.

## Installation

To install the module, you can use npm or yarn:

```bash
npm install kleros-curate-cdnq
```

or

```bash
yarn add kleros-curate-cdnq
```

## API

### `returnCDNEntries(chainId: string, apiKey: string | null): Promise<CDNEntry[]>`

- **Parameters:**

  - `chainId`: The ID of the blockchain network (e.g., "1" for Ethereum Mainnet).
  - `apiKey`: Your API key for accessing the subgraph.

- **Returns:** A promise that resolves to an array of `CDNEntry` objects.

## Error Handling

The module includes error handling for various scenarios, including:

- HTTP errors when fetching data from the subgraph.
- GraphQL errors returned from the API.
- Missing or invalid data in the response.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments

- Kleros for providing the decentralized dispute resolution platform.
- The Graph for enabling efficient querying of blockchain data.
