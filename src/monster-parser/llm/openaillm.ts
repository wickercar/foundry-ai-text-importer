import { OpenAI } from 'langchain/llms/openai';
import OpenAIAPIKeyStorage from '../settings/openai-api-key/OpenAIAPIKeyStorage';

const OpenAILLM = (model?: string) => {
  const modelName = model || (game.settings.get('llm-text-content-importer', 'openaiModel') as string);
  console.log('initializing OpenAI with model: ', modelName);
  return new OpenAI({
    modelName,
    temperature: 0,
    openAIApiKey: OpenAIAPIKeyStorage.getApiKey(),
  });
};

export default OpenAILLM;
