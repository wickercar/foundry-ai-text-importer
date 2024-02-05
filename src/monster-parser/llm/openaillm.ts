import { OpenAI } from 'langchain/llms/openai';
import OpenAIAPIKeyStorage from '../settings/openai-api-key/OpenAIAPIKeyStorage';

const OpenAILLM = () => {
  const modelSetting = game.settings.get('llm-text-content-importer', 'openaiModel') as string;
  console.log('initializing OpenAI with model: ', modelSetting);
  return new OpenAI({
    modelName: game.settings.get('llm-text-content-importer', 'openaiModel') as string,
    temperature: 0,
    openAIApiKey: OpenAIAPIKeyStorage.getApiKey(),
  });
};

export default OpenAILLM;
