import { OpenAIEmbeddingFunction } from "chromadb";
import { ChromaClient } from "chromadb";

const openai_api_key = process.env.OPENAI_API_KEY as string;
const path = process.env.RAILWAY_URL as string;

export const embedder = new OpenAIEmbeddingFunction({ openai_api_key });
export const client = new ChromaClient({ path });
