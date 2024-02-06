import OpenAIAPIKeyStorage from './OpenAIAPIKeyStorage';
/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore - it's got a problem with my defaultOptions, I can't get why
export default class OpenAIAPIKeyForm extends FormApplication {
  onValidated: () => void;

  constructor(options, onValidated: () => void = () => undefined) {
    super(options);
    this.onValidated = onValidated;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: 'OpenAI API Key',
      classes: ['form', 'sheet'],
      template: 'modules/llm-text-content-importer/templates/openai_api_key_form.hbs',
      width: 500,
      height: 'auto',
      closeOnSubmit: false,
      submitOnChange: false,
      submitOnClose: false,
      id: 'openai-api-key-form',
    });
  }
  /** @override */
  async getData(options): Promise<any> {
    console.log('getData in key form: ', options);
    const isValid = await OpenAIAPIKeyStorage.isStoredApiKeyValid();
    if (isValid) this.onValidated();
    return {
      // TODO - add non-localStorage option
      apiKey: OpenAIAPIKeyStorage.getApiKey(),
      isValid,
    };
  }

  get title() {
    // TODO - localize
    return 'OpenAI API Key Settings';
  }

  async _updateObject(event, formData) {
    OpenAIAPIKeyStorage.setApiKey(formData.apiKey);
    this.render();
  }
}
