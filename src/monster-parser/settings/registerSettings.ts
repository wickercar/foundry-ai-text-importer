import OpenAIAPIKeyForm from './openai-api-key/OpenAIAPIKeyForm';

export const registerSettings = (): void => {
  game.settings.registerMenu('llm-text-content-importer', 'openaiAPIKeyMenu', {
    name: 'OpenAI API Key',
    label: 'OpenAI API Key',
    hint: 'Your Secret API key for OpenAI (stored locally)',
    icon: 'fas fa-wrench',
    type: OpenAIAPIKeyForm, // Number, Boolean, String, Object
    restricted: true,
  });
  console.log('registered `llm-text-content-importer` settings!');
};
