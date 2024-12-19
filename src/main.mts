import fetch from "node-fetch";
import { CDNEntry, ICDNService } from "cdnq-types";

const SUBGRAPH_URLS: Record<string, { decentralized: string }> = {
  // Ethereum Mainnet: https://thegraph.com/explorer/subgraphs/A5oqWboEuDezwqpkaJjih4ckGhoHRoXZExqUbja2k1NQ?view=Query&chain=arbitrum-one
  "1": {
    decentralized:
      "https://gateway-arbitrum.network.thegraph.com/api/[api-key]/deployments/id/QmWBxe8NGXNhELgARirbXbjyKj8nHpQYQvQhFk9U62PZL1",
  },
  // Gnosis: https://thegraph.com/explorer/subgraphs/9hHo5MpjpC1JqfD3BsgFnojGurXRHTrHWcUcZPPCo6m8?view=Query&chain=arbitrum-one
  "100": {
    decentralized:
      "https://gateway-arbitrum.network.thegraph.com/api/[api-key]/deployments/id/QmeregtvXdwydExdwVBs5YEwNV4HC1DKqQoyRgTbkbvFA7",
  },
};

const headers: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const GET_REGISTRIES_QUERY = `
  query GetRegistries {
    lregistries {
      id
      metadata {
        title
        description
      }
    }
  }
`;

interface GraphQLResponse {
  data?: {
    lregistries: {
      id: string;
      metadata: {
        title: string;
        description: string;
      };
    }[];
  };
  errors?: { message: string }[];
}

async function fetchData(subgraphUrl: string): Promise<CDNEntry[]> {
  const response = await fetch(subgraphUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: GET_REGISTRIES_QUERY,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const result = (await response.json()) as GraphQLResponse;
  if (result.errors) {
    result.errors.forEach((error: any) => {
      console.error(`GraphQL error: ${error.message}`);
    });
    throw new Error("GraphQL errors occurred: see logs for details.");
  }
  if (!result.data || !result.data.lregistries) {
    throw new Error("No registries data found.");
  }

  return result.data.lregistries
    .map((registry) => {
      return {
        "Contract address": registry.id,
        "Domain name": "curate.kleros.io",
        "Visual proof":
          "/ipfs/QmSJJA2ioKwpWJpCGtctvhCL1FfJws1TRAG11ZJZrmzTEt/kleros-cdn.jpg",
      };
    })
    .filter((registry) => registry !== null); // Filter out null entries
}

function prepareUrl(chainId: string, apiKey: string): string {
  const urls = SUBGRAPH_URLS[chainId];
  if (!urls || isNaN(Number(chainId))) {
    const supportedChainIds = Object.keys(SUBGRAPH_URLS).join(", ");
    throw new Error(
      `Unsupported or invalid Chain ID provided: ${chainId}. Only the following values are accepted: ${supportedChainIds}`
    );
  }
  return urls.decentralized.replace("[api-key]", encodeURIComponent(apiKey));
}

class CDNService implements ICDNService {
  returnCDNEntries = async (
    chainId: string,
    apiKey: string | null
  ): Promise<CDNEntry[]> => {
    const url = prepareUrl(chainId, apiKey!);
    const registries = await fetchData(url);
    return registries;
  };
}

// Creating an instance of CDNService
const cdnServiceInstance = new CDNService();

// Exporting the returnCDNEntries method directly
export const returnCDNEntries = cdnServiceInstance.returnCDNEntries;
