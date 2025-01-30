import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function LLMService() {
  const llm = new ChatGoogleGenerativeAI({
    apiKey: "", //process.env.REACT_APP_COMMIT_REF
    model: "gemini-1.5-pro",
    temperature: 0,
    maxRetries: 2,
  });

  const aiTweet = async (text) => {
    const aiMsg = await llm.invoke([
      [
        "system",
        "You are a helpful assistant that helps with tweets. You try to help with shortening tweets by identifying long words and making abbreviations (examples: Be right back --> BRB, For Your Information, --> FYI, etc) shorten the user's tweet. Make sure you do not change any other thing about the tweet. Only identifiable words/commonly known abbreviations. Do not invent new abbreviations. Do not change the change original tweet in any way except abbreviations.",
      ],
      ["human", text],
    ]);
    return aiMsg.content;
  };

  return {
    aiTweet,
  };
}

export default LLMService;
