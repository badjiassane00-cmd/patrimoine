import Anthropic from "@anthropic-ai/sdk";
import { siteKnowledge, storytellerPrompt } from "../knowledge.js";
import { createLocalChatResponder, createLocalStoryGenerator } from "./localResponses.js";

function extractText(result) {
  return result.content.find((block) => block.type === "text")?.text;
}

export function createStorytellingService({ apiKey, model = "claude-3-5-haiku-latest", client, localChat, localStory } = {}) {
  const anthropic = client || (apiKey ? new Anthropic({ apiKey }) : null);
  const chatFallback = localChat || createLocalChatResponder();
  const storyFallback = localStory || createLocalStoryGenerator();

  return {
    isConfigured: Boolean(anthropic),
    async answer(messages) {
      if (!anthropic) return { message: chatFallback.answer(messages.at(-1).content), mode: "local" };
      const result = await anthropic.messages.create({ model, max_tokens: 500, system: siteKnowledge, messages });
      return { message: extractText(result) || "Je n'ai pas trouvé de réponse dans nos archives." };
    },
    async generate(subject, tone) {
      if (!anthropic) return { story: storyFallback.generate(subject, tone), mode: "local" };
      const result = await anthropic.messages.create({
        model,
        max_tokens: 600,
        system: storytellerPrompt,
        messages: [{ role: "user", content: `Sujet : ${subject}\nTon souhaité : ${tone}` }],
      });
      return { story: extractText(result) || storyFallback.generate(subject, tone) };
    },
  };
}
