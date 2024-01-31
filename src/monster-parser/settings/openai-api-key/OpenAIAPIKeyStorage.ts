export default class OpenAIAPIKeyStorage {
  static setApiKey(apiKey: string) {
    localStorage.setItem('openai-api-key', apiKey);
  }

  static getApiKey(): string {
    return localStorage.getItem('openai-api-key') || '';
  }
}
