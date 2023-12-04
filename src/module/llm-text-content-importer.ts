Hooks.once('init', async () => {
  console.log('llm-text-content-importer Initialized!!');
});

Hooks.on('ready', async () => {
  console.log('llm-text-content-importer Ready!!');
});

// Show the
// Hooks.on('renderActorSheet', (actorSheet, html, actor) => {
//   log('rendering actor sheet: ', actorSheet, html, actor);

//   const button = $('<button type="button" id="llmFlavorerButton"><div>Flavorer</div></button>');

//   button.click((event) => {
//     log('clicked flavorer button!');
//     new FlavorerForm(FlavorerForm.defaultOptions, actor.actor).render(true);
//   });
//   const titleElement = html.closest('.app').find('.charname');
//   if (!actorSheet._minimized) button.insertAfter(titleElement);
//   log('inserted button');
// });

/*

  $('.directory-header .header-actions', $('[data-tab="actors"]'))
    .filter((i, e) => !$(e).has('#hct-directory-button').length)
    .append(
      `<button id='hct-directory-button' data-hct_start><i class='fas fa-dice-d20'></i>${game.i18n.localize(
        'HCT.ActorsDirectoryButton',
      )}</button>`,
    );
  $('[data-hct_start]').on('click', function () {
    if (userHasRightPermissions()) app.openForNewActor();
  });
  */

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
    console.log('clicked actor directory button');
  });
});
