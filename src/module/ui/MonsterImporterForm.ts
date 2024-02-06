import { OpenAI } from 'langchain/llms/openai';
import genFoundry5eMonsterActorFromTextBlock from '../genFoundryActorFromMonsterTextBlock';
import OpenAIAPIKeyStorage from '../monster-parser/settings/openai-api-key/OpenAIAPIKeyStorage';
import OpenAIAPIKeyForm from '../monster-parser/settings/openai-api-key/OpenAIAPIKeyForm';
import foundryMonsterCompendia, {
  DEFAULT_MONSTER_COMPENDIUM_NAME,
} from '../monster-parser/foundry-compendia/FoundryMonsterCompendia';
import { fetchGPTModels } from '../monster-parser/llm/openaiModels';
import featureFlags from '../featureFlags';
import { Data } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/foundry.js/roll';

type DropdownOption = {
  name: string;
  label: string;
  isSelected: boolean;
};

type FormData = {
  title: string;
  invalidAPIKey: boolean;
  isLoading: boolean;
  actorCompendiumOptions: DropdownOption[];
  modelOptions: DropdownOption[];
  showModelSelector: boolean;
};
/**
 * Imports a monster from a single text block using AI
 *
 * Eventually, this will not be for just monsters, or there will be a generalized version.
 **/
class MonsterImporterForm extends FormApplication {
  userText: string;
  isLoading = false;
  isAPIKeyValid = true;
  keyForm: OpenAIAPIKeyForm;

  constructor(options) {
    super(options);
    this.userText = '';
    this.checkAPIKey();
    this.keyForm = new OpenAIAPIKeyForm(OpenAIAPIKeyForm.defaultOptions, this.reload);
  }

  reload = async () => {
    this.render();
    await this.keyForm.close({ force: true });
  };

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.title = game.i18n.localize('LLMTCI.MonsterFormTitle');
    options.template = 'modules/llm-text-content-importer/templates/monster_importer_form.hbs';
    options.width = 900;
    options.height = 'auto';
    options.classes = ['sheet'];
    options.resizable = true;
    return options;
  }

  startLoad() {
    this.isLoading = true;
    this.render();
  }

  endLoad() {
    this.isLoading = false;
    this.render();
  }

  activateListeners(html) {
    super.activateListeners(html);
    $(html)
      .find('#llmtci-submit')
      .on('click', async (event) => {
        event.preventDefault();
        const userText = $(html).find('#llmtci-userText').val() as string;
        this.userText = userText;
        this.startLoad();
        console.log('monster text submitted: ', userText);
        const actor = await genFoundry5eMonsterActorFromTextBlock(userText);
        console.log('actor generated : ', actor);
        this.endLoad();
      });
    $(html)
      .find('#llmtci-updateAPIKey')
      .on('click', async (event) => {
        event.preventDefault();
        /** Providing this.render as a way to reload after key is validated */
        this.keyForm.render(true);
      });
    $(html)
      .find('#llmtci-compendiumSelect')
      .on('change', async (event) => {
        event.preventDefault();
        const selectedCompendiumName = $(html).find('#llmtci-compendiumSelect').val();
        console.log('changing compendium setting to: ', selectedCompendiumName);
        game.settings.set('llm-text-content-importer', 'compendiumImportDestination', selectedCompendiumName);
      });
    if (featureFlags.modelSelector) {
      $(html)
        .find('#llmtci-modelSelect')
        .on('change', async (event) => {
          event.preventDefault();
          const selectedModelId = $(html).find('#llmtci-modelSelect').val();
          game.settings.set('llm-text-content-importer', 'openaiModel', selectedModelId);
        });
    }
  }

  async checkAPIKey(): Promise<void> {
    const isValid = await OpenAIAPIKeyStorage.isStoredApiKeyValid();
    console.log('isValid: ', isValid);
    if (!isValid) {
      console.error('Invalid API Key');
      this.isAPIKeyValid = false;
    } else {
      this.isAPIKeyValid = true;
    }
  }

  async getData(): Promise<any> {
    const superData = await super.getData();
    await Promise.all([
      foundryMonsterCompendia.ensureDefaultCompendiumExists(),
      foundryMonsterCompendia.validateAndMaybeResetSelectedCompendium(),
      this.checkAPIKey(),
    ]);
    const data = {
      ...superData,
      title: this.options.title,
      invalidAPIKey: !this.isAPIKeyValid,
      isLoading: this.isLoading,
      actorCompendiumOptions: await this.genActorCompendiumOptions(),
      showModelSelector: featureFlags.modelSelector,
      modelOptions: featureFlags.modelSelector ? await this.genModelOptions() : [],
    };
    return data;
  }

  async genActorCompendiumOptions(): Promise<DropdownOption[]> {
    const actorCompendia = await foundryMonsterCompendia.getAllActorCompendia();
    // Compendium options
    const selectedCompendiumName = game.settings.get('llm-text-content-importer', 'compendiumImportDestination');
    return actorCompendia.map((compendium) => {
      return {
        name: compendium.metadata.name,
        label: compendium.metadata.label,
        isSelected: selectedCompendiumName === compendium.metadata.name,
      };
    });
  }

  async genModelOptions(): Promise<DropdownOption[]> {
    const gptModels = await fetchGPTModels();
    const selectedModelId = game.settings.get('llm-text-content-importer', 'openaiModel');
    return gptModels.map((model) => {
      return {
        name: model.id,
        label: model.id,
        isSelected: selectedModelId === model.id,
      };
    });
  }

  async _updateObject(event: Event, formData): Promise<unknown> {
    return 1;
  }
}

export default MonsterImporterForm;
