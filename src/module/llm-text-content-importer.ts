import MonsterImporterForm from './ui/MonsterImporterForm';

Hooks.once('init', async () => {
  console.log('llm-text-content-importer Initialized!!');
});

Hooks.on('ready', async () => {
  console.log('llm-text-content-importer Ready!!');
});

Hooks.on('renderActorDirectory', () => {
  $('.directory-header .header-actions', $('[data-tab="actors"]'))
    .filter((i, e) => !$(e).has('#llm-text-content-importer-button').length)
    .append(
      `<button id='llm-text-content-importer-button' data-llm-text-content-importer_start><i class='fas fa-dice-d20'></i>${game.i18n.localize(
        // TODO - fix localization
        // 'LLMTCI.ActorsDirectoryButton',
        'LLM Text Content Importer',
      )}</button>`,
    );
  $('[data-llm-text-content-importer_start]').on('click', () => {
    new MonsterImporterForm(MonsterImporterForm.defaultOptions).render(true);
  });
});
