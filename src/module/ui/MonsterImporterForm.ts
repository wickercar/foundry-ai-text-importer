import { OpenAI } from 'langchain/llms/openai';
import genFoundry5eMonsterActorFromTextBlock from '../genFoundryActorFromMonsterTextBlock';
import OpenAIAPIKeyStorage, {
  APIKeyValidationStatus,
} from '../monster-parser/settings/openai-api-key/OpenAIAPIKeyStorage';
import OpenAIAPIKeyForm from '../monster-parser/settings/openai-api-key/OpenAIAPIKeyForm';
import foundryMonsterCompendia, {
  DEFAULT_MONSTER_COMPENDIUM_NAME,
} from '../monster-parser/foundry-compendia/FoundryMonsterCompendia';
import { fetchGPTModels } from '../monster-parser/llm/openaiModels';
import featureFlags from '../featureFlags';
import { Data } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/foundry.js/roll';
import TaskTracker from '../performanceUtils/TaskTracker';

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

const RERENDER_DURING_LOAD_INTERVAL_MS = 1000;
/**
 * Imports a monster from a single text block using AI
 *
 * Eventually, this will not be for just monsters, or there will be a generalized version.
 **/
class MonsterImporterForm extends FormApplication {
  userText: string;
  isLoading = false;
  apiKeyValidationStatus: APIKeyValidationStatus = 'VALID'; // Initialize to VALID but validate in the background
  doesAPIKeyHaveProperModelAccess = true;
  showProgressView = false;
  // one-timevalidators
  hasValidatedAPIKey = false;
  hasEnsuredDefaultCompendiumExists = false;
  hasValidatedSelectedCompendium = false;
  keyForm: OpenAIAPIKeyForm;
  // Loading Tasks
  tickerTimeout: NodeJS.Timeout;
  // View state

  constructor(options) {
    super(options);
    this.userText = '';
    this.checkAPIKey();
    this.keyForm = new OpenAIAPIKeyForm(OpenAIAPIKeyForm.defaultOptions, this.reload);
    // Not the best place for this, I want to decouple this from MonsterImporterForm
    TaskTracker.clear();
  }

  reload = async () => {
    this.hasValidatedAPIKey = false; // re-validate API key
    this.hasEnsuredDefaultCompendiumExists = false;
    this.hasValidatedSelectedCompendium = false;
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
    this.showProgressView = true;
    // when loading, "tick" to rerender and update the time elapsed
    this.tickerTimeout = setInterval(() => {
      this.render();
    }, RERENDER_DURING_LOAD_INTERVAL_MS);
  }

  endLoad() {
    this.isLoading = false;
    clearInterval(this.tickerTimeout);
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
        // main text block parsing function
        await genFoundry5eMonsterActorFromTextBlock(userText);
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
    if (this.showProgressView) {
      $(html)
        .find('#llmtci-import-another')
        .on('click', async (event) => {
          event.preventDefault();
          this.showProgressView = false;
          TaskTracker.clear();
          this.render();
        });
    }
  }

  async checkAPIKey(): Promise<void> {
    const formerApiKeyValidationStatus = this.apiKeyValidationStatus;
    this.apiKeyValidationStatus = await OpenAIAPIKeyStorage.getStoredApiKeyValidationStatus();
    if (formerApiKeyValidationStatus !== this.apiKeyValidationStatus) {
      this.render();
    }
  }

  async getData(): Promise<any> {
    const superData = await super.getData();

    const validators: Promise<any>[] = [];
    if (!this.hasValidatedAPIKey) {
      validators.push(this.checkAPIKey());
      this.hasValidatedAPIKey = true;
    }
    if (!this.hasEnsuredDefaultCompendiumExists) {
      validators.push(foundryMonsterCompendia.ensureDefaultCompendiumExists());
      this.hasEnsuredDefaultCompendiumExists = true;
    }
    if (!this.hasValidatedSelectedCompendium) {
      validators.push(foundryMonsterCompendia.validateAndMaybeResetSelectedCompendium());
      this.hasValidatedSelectedCompendium = true;
    }

    await Promise.all(validators);
    const data = {
      ...superData,
      title: this.options.title,
      apiKeyIsInvalid: this.apiKeyValidationStatus === 'INVALID_KEY',
      apiKeyHasNoModelAccess: this.apiKeyValidationStatus === 'NO_MODEL_ACCESS',
      isLoading: this.isLoading,
      showProgressView: this.showProgressView,
      // isLoading: true, // TEMP - harcoding to true to test loading spinner
      actorCompendiumOptions: await this.genActorCompendiumOptions(),
      showModelSelector: featureFlags.modelSelector,
      modelOptions: featureFlags.modelSelector ? await this.genModelOptions() : [],
      tasks: TaskTracker.tasks,
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
