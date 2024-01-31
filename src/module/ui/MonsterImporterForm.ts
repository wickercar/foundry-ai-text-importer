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

  constructor(options) {
    super(options);
    this.userText = '';
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

  activateListeners(html) {
    super.activateListeners(html);
    $(html)
      .find('#llmtci-submit')
      .on('click', async (event) => {
        event.preventDefault();
        const userText = $(html).find('#llmtci-userText').val() as string;
        this.userText = userText;
        console.log('monster text submitted: ', userText);
        const actor = await genFoundry5eMonsterActorFromTextBlock(userText);
        console.log('actor generated : ', actor);
      });
    $(html)
      .find('#llmtci-updateAPIKey')
      .on('click', async (event) => {
        event.preventDefault();
        new OpenAIAPIKeyForm(OpenAIAPIKeyForm.defaultOptions).render(true);
      });
  }

  async getData(): Promise<any> {
    return {
      title: this.options.title,
      invalidAPIKey: !(await OpenAIAPIKeyStorage.isStoredApiKeyValid()),
    };
  }

  async _updateObject(event: Event, formData): Promise<unknown> {
    return 1;
  }
}

export default MonsterImporterForm;
