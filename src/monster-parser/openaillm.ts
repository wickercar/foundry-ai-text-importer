import { OpenAI } from 'langchain/llms/openai';
import OpenAIAPIKeyStorage from './settings/openai-api-key/OpenAIAPIKeyStorage';

const OpenAILLM = () =>
  new OpenAI({
    modelName: 'gpt-4',
    temperature: 0,
    openAIApiKey: OpenAIAPIKeyStorage.getApiKey(),
  });

export default OpenAILLM;
