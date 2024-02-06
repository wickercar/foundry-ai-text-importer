import { Foundry5eMonster } from './monster-parser/schemas/foundry/monster/Foundry5eMonster';
import { registerSettings } from './monster-parser/settings/registerSettings';
import { createFoundryActor } from './createFoundryActor';
import registerQuenchTests from './quench/registerQuenchTests';
import testRatkingWarfOutput from './quench/testRatkingWarfOutput';
import MonsterImporterForm from './ui/MonsterImporterForm';

Hooks.on('ready', async () => {
  registerSettings();
});

Hooks.on('quenchReady', (quench) => {
  registerQuenchTests(quench);
});

Hooks.on('renderActorDirectory', () => {
  $('.directory-header .header-actions', $('[data-tab="actors"]'))
    .filter((i, e) => !$(e).has('#llm-text-content-importer-button').length)
    .append(
      `<button id='llm-text-content-importer-button' data-llm-text-content-importer_start><i class='fas fa-scroll-old'></i>&nbsp;${game.i18n.localize(
        'LLMTCI.ActorsDirectoryButton',
      )}</button>`,
    );
  $('[data-llm-text-content-importer_start]').on('click', () => {
    new MonsterImporterForm(MonsterImporterForm.defaultOptions).render(true);
  });
});
