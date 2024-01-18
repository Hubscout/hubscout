import { NextRequest, NextResponse } from "next/server";
import { ChromaClient } from "chromadb";
import { OpenAIEmbeddingFunction } from "chromadb";
import { PrismaClient } from "@prisma/client";
/*
  model UserEmbedding {
    fid                       String       @id
    fname                     String?
    pfp                       String?
    description               String?
    bio                       String?
    embedding                 String
    pageRankScore             Float?
    createdAt                 DateTime     @default(now())
    similaritiesAsUser        Similarity[] @relation("UserEmbedding")
    similaritiesAsSimilarUser Similarity[] @relation("SimilarUser")
    Following                 Following[]  @relation("follower")
    Followers                 Following[]  @relation("following")
  }

  */
const getUserInfo = async (fid: string) => {
  const userInfo = await fetch(
    `https://api.neynar.com/v1/farcaster/user?fid=${fid}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        api_key: process.env.NEXT_PUBLIC_NEYNAR_API as string,
      },
    }
  );
  const userInfoJson = await userInfo.json();
  if (!userInfoJson.result || !userInfoJson.result.user) return {};
  return userInfoJson.result.user;
};

export async function GET(request: NextRequest, { params }: { params: any }) {
  const searchParams = request.nextUrl.searchParams;
  console.log(searchParams);
  const query = searchParams.get("query");

  const limit = searchParams.get("limit");

  if (!query) return NextResponse.error();
  const decodedQuery = decodeURIComponent(query);

  const { NEXT_PUBLIC_OPENAI_API_KEY, NEXT_PUBLIC_RAILWAY_URL } = process.env;
  const client = new ChromaClient({
    path: NEXT_PUBLIC_RAILWAY_URL,
  });
  const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: NEXT_PUBLIC_OPENAI_API_KEY as string,
  });
  const embeddingCollection = await client.getOrCreateCollection({
    name: process.env.NEXT_PUBLIC_COLLECTION_NAME as string,
    embeddingFunction: embedder,
  });

  const results = await embeddingCollection.query({
    nResults: limit ? parseInt(limit) : 5,
    queryTexts: decodedQuery,
  });

  let casts = await Promise.all(
    await results.ids[0].map(async (id: any, index) => {
      let userInfo = {};
      console.log(results?.metadatas?.[0]);
      const userInfoFid = results?.metadatas?.[0]?.[index]?.fid?.toString();
      console.log(userInfoFid);
      if (userInfoFid) {
        userInfo = await getUserInfo(userInfoFid);
      }

      return {
        hash: id,
        cast: results.documents[0][index],
        ...userInfo,
      };
    })
  );
  console.log(casts);

  // First try to find users by fname

  return NextResponse.json({ casts });
}
