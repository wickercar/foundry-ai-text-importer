const VALIDATION_API_ENDPOINT = 'https://api.openai.com/v1/models';

export default class OpenAIAPIKeyStorage {
  static setApiKey(apiKey: string) {
    localStorage.setItem('openai-api-key', apiKey);
  }

  static getApiKey(): string {
    return localStorage.getItem('openai-api-key') || '';
  }

  static async isStoredApiKeyValid(): Promise<boolean> {
    const apiKey = OpenAIAPIKeyStorage.getApiKey();
    if (apiKey === '') {
      return false;
    }
    // Validate the key against the backend
    const response = await fetch(VALIDATION_API_ENDPOINT, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      return true;
    }
    console.error('OpenAI API Key validation failed: ', response.status, response.statusText);
    return false;
  }
}
