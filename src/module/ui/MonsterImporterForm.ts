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
      });
  }

  async _updateObject(event: Event, formData?: object | undefined): Promise<unknown> {
    return 1;
  }
}

export default MonsterImporterForm;
