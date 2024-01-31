// const saveMonsterToCompendium = async (monster, compendiumName, compendiumLabel) => { };
export const DEFAULT_MONSTER_COMPENDIUM_LABEL = 'AI Importer Monsters';
export const DEFAULT_MONSTER_COMPENDIUM_NAME = 'ai-importer-monsters';

const getCompendiumByName = async (compendiumName: string, packageType = 'world') => {
  return await game.packs.get(`${packageType}.${compendiumName}`);
};

const saveAIImportedMonsterToCompendium = async (
  monster: Actor,
  compendiumName: string | undefined = DEFAULT_MONSTER_COMPENDIUM_NAME,
  compendiumLabel: string | undefined = DEFAULT_MONSTER_COMPENDIUM_NAME,
): Promise<void> => {
  const compendium = await getCompendiumOrCreateIfNotExists(compendiumName, compendiumLabel);
  await compendium?.importDocument(monster);
  console.log('Monster saved to compendium', monster, compendium);
};

const getAllActorCompendia = async () => {
  return game.packs.filter((pack) => pack.metadata.entity === 'Actor');
};

const getCompendiumOrCreateIfNotExists = async (compendiumName, compendiumLabel) => {
  // Not sure if this is right
  let compendium = await getCompendiumByName(compendiumName);
  console.log('compendium found?', compendium);
  if (!compendium) {
    compendium = await CompendiumCollection.createCompendium(
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore I think this is a bug in the foundry-vtt-types
        type: 'Actor',
        label: compendiumLabel,
        name: compendiumName,
        package: 'world',
        path: `world.${compendiumName}`,
        private: true,
        system: 'dnd5e',
        // message: 'Compendium for AI imported monsters',
      },
      {},
    );
    console.log('created new Compendium: ', compendium);
  }
  return compendium;
};

export default {
  getCompendiumByName,
  getCompendiumOrCreateIfNotExists,
  saveAIImportedMonsterToCompendium,
  getAllActorCompendia,
};
