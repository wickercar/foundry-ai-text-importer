import OpenAIAPIKeyForm from './openai-api-key/OpenAIAPIKeyForm';

export const registerSettings = (): void => {
  game.settings.registerMenu('llm-text-content-importer', 'openaiAPIKeyMenu', {
    name: game.i18n.localize('LLMTCI.OpenAIAPIKeySubmenuButtonLabel'),
    label: game.i18n.localize('LLMTCI.OpenAIAPIKeySubmenuButtonLabel'),
    hint: game.i18n.localize('LLMTCI.OpenAIAPIKeySubmenuButtonHint'),
    icon: 'fas fa-wrench',
    type: OpenAIAPIKeyForm, // Number, Boolean, String, Object
    restricted: true,
  });
  game.settings.register('llm-text-content-importer', 'compendiumImportDestination', {
    name: game.i18n.localize('LLMTCI.CompendiumImportDestinationSettingLabel'),
    hint: game.i18n.localize('LLMTCI.CompendiumImportDestinationSettingHint'),
    type: String,
    config: true, // Might want to take it out and just have it in input UI
    scope: 'world', // "world" | "client" | "server"
  });
  game.settings.register('llm-text-content-importer', 'openaiModel', {
    name: game.i18n.localize('LLMTCI.OpenAIModelSettingLabel'),
    hint: game.i18n.localize('LLMTCI.OpenAIModelSettingHint'),
    type: String,
    config: true, // Might want to take it out and just have it in input UI
    scope: 'world', // "world" | "client" | "server"
  });
};
