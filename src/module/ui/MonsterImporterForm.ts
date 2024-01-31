import { OpenAI } from 'langchain/llms/openai';
import genFoundry5eMonsterActorFromTextBlock from '../genFoundryActorFromMonsterTextBlock';
import OpenAIAPIKeyStorage from '../../monster-parser/settings/openai-api-key/OpenAIAPIKeyStorage';
import OpenAIAPIKeyForm from '../../monster-parser/settings/openai-api-key/OpenAIAPIKeyForm';

/**
 * Imports a monster from a single text block using AI
 *
 * Eventually, this will not be for just monsters, or there will be a generalized version.
 **/
class MonsterImporterForm extends FormApplication {
  userText: string;
  isLoading = false;
  isAPIKeyValid = true;

  constructor(options) {
    super(options);
    this.userText = '';
    this.checkAPIKey();
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.title = 'Monster Importer';
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
        new OpenAIAPIKeyForm(OpenAIAPIKeyForm.defaultOptions).render(true);
      });
  }

  async checkAPIKey() {
    this.startLoad();
    const isValid = await OpenAIAPIKeyStorage.isStoredApiKeyValid();
    if (!isValid) {
      console.error('Invalid API Key');
      this.isAPIKeyValid = false;
    } else {
      this.isAPIKeyValid = true;
    }
    this.endLoad();
  }

  async getData(): Promise<any> {
    return {
      title: this.options.title,
      invalidAPIKey: !this.isAPIKeyValid,
      isLoading: this.isLoading,
    };
  }

  async _updateObject(event: Event, formData): Promise<unknown> {
    return 1;
  }
}

export default MonsterImporterForm;
