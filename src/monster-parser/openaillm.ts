import { OpenAI } from 'langchain/llms/openai';

const OpenAILLM = () =>
  new OpenAI({
    modelName: 'gpt-4',
    temperature: 0,
    openAIApiKey: 'placeholder-key',
  });

export default OpenAILLM;
