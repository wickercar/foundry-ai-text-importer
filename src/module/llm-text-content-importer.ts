import { Foundry5eMonster } from '../monster-parser/schemas/foundry/monster/Foundry5eMonster';
import { registerSettings } from '../monster-parser/settings/registerSettings';
import { importFoundry5eMonsterToFoundry } from './importMonsterToFoundry';
import registerQuenchTests from './quench/registerQuenchTests';
import testRatkingWarfOutput from './quench/testRatkingWarfOutput';
import MonsterImporterForm from './ui/MonsterImporterForm';

Hooks.once('init', async () => {
  console.log('llm-text-content-importer Initialized!!');
});

Hooks.on('ready', async () => {
  console.log('llm-text-content-importer Ready!!');
  registerSettings();
  // Temp for testing - Hardcoded Foundry5eMonster => Actor
  // const testRatkingActor = await importFoundry5eMonsterToFoundry(testRatkingWarfOutput as Foundry5eMonster);
  // testRatkingActor.sheet?.render(true);
});

Hooks.on('quenchReady', (quench) => {
  registerQuenchTests(quench);
  // comment out to not auto-run tests
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
