/**
 * Imports a monster from a single text block using AI
 *
 * Eventually, this will not be for just monsters, or there will be a generalized version.
 **/
class MonsterImporterForm extends FormApplication {
  monsterText: string;

  constructor(options) {
    super(options);
    this.monsterText = '';
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
      .find('#llmmi-submit')
      .on('click', async (event) => {
        event.preventDefault();
        const monsterText = $(html).find('#llmmi-userPrompt').val() as string;
        this.monsterText = monsterText;
        console.log('monster text submitted: ', monsterText);
      });
  }

  async _updateObject(event: Event, formData?: object | undefined): Promise<unknown> {
    return 1;
  }
}

export default MonsterImporterForm;
