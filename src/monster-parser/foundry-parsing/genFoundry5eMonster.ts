import { Parsed5eLLMMonster } from '../schemas/parsed-input-data/monster/Parsed5eMonster';
import type { Foundry5eMonster } from '../schemas/foundry/monster/Foundry5eMonster';
import { Foundry5eMonsterAttributes } from '../schemas/foundry/monster/Foundry5eMonsterAttributes';
import { Foundry5eMonsterDetails } from '../schemas/foundry/monster/Foundry5eMonsterDetails';
import { Foundry5eMonsterTraits } from '../schemas/foundry/monster/Foundry5eMonsterTraits';
import { Foundry5eMonsterCurrency } from '../schemas/foundry/monster/Foundry5eMonsterCurrency';
import {
  Foundry5eMonsterBonuses,
  Foundry5eMonsterBonusesSchema,
} from '../schemas/foundry/monster/Foundry5eMonsterBonuses';
import {
  Foundry5eMonsterSpells,
  Foundry5eMonsterSpellsSchema,
} from '../schemas/foundry/monster/Foundry5eMonsterSpells';
import {
  Foundry5eMonsterSkills,
  Foundry5eMonsterSkillsSchema,
} from '../schemas/foundry/monster/Foundry5eMonsterSkills';
import {
  Foundry5eMonsterResources,
  Foundry5eMonsterResourcesSchema,
} from '../schemas/foundry/monster/Foundry5eMonsterResources';
import { genFoundryItemFromNameAndText } from './item/genFoundry5eItem';
import { Foundry5eItem } from '../schemas/foundry/item/Foundry5eItem';

import gargoyleJSON from '../srd/foundry_db_pastes/gargoyle.json';
import { sizeToFoundrySize } from '../schemas/enums/Size';

const genFoundry5eMonster = async (parsedMonsterData: Parsed5eLLMMonster): Promise<Foundry5eMonster> => {
  const converter = new WarfMonsterToFoundryConverter(parsedMonsterData);

  // must call gen before returning
  await converter.gen();

  return {
    name: converter.name,
    items: converter.items,
    system: converter.system,
    // _stats: converter._stats,
    type: converter.type,
    img: converter.img,
    effects: converter.effects,
    // TODO - update folder for compendium?
    folder: converter.folder,
    sort: converter.sort,
    ownership: {
      default: 0,
    },
    flags: {},
    _id: '',
  };
};

class WarfMonsterToFoundryConverter implements Foundry5eMonster {
  constructor(parsedMonsterData: Parsed5eLLMMonster) {
    this.parsedMonsterData = parsedMonsterData;
  }

  items: Foundry5eItem[] = [];

  async gen() {
    const allItemNameAndTexts = [
      ...this.parsedMonsterData.specialTraits,
      ...this.parsedMonsterData.actions,
      ...this.parsedMonsterData.legendaryActions,
    ];
    const allItems = await Promise.all(
      allItemNameAndTexts.map(async ({ name, text }) => {
        const item = await genFoundryItemFromNameAndText({ name, text });
        return item;
      }),
    );
    this.items = allItems;
  }

  private parsedMonsterData: Parsed5eLLMMonster;

  get system() {
    return {
      abilities: this.abilities,
      attributes: this.attributes,
      details: this.details,
      traits: this.traits,
      currency: this.currency,
      skills: this.skills,
      spells: this.spells,
      bonuses: this.bonuses,
      resources: this.resources,
    };
  }
  // Hardcoded values
  type: 'npc' = 'npc';
  img = '';
  effects = [];
  folder = null;
  sort = 0;
  ownership = { default: 0 };
  flags = {};
  _id = '';

  get name(): string {
    return this.parsedMonsterData.name;
  }

  get abilities() {
    // Schemas here are identical (with optional fields in warf version)
    return this.parsedMonsterData.abilities;
  }

  get attributes(): Foundry5eMonsterAttributes {
    const { parsedMonsterData } = this;
    return {
      ac: {
        flat: parsedMonsterData.armorClass.value,
        calc: parsedMonsterData.armorClass.type,
        formula: parsedMonsterData.armorClass.formula,
      },
      hp: {
        value: parsedMonsterData.hitPoints.average,
        max: parsedMonsterData.hitPoints.average,
        formula: parsedMonsterData.hitPoints.formula,
      },
      // TODO
      init: {
        ability: 'dex',
        bonus: '',
      },
      movement: {
        ...parsedMonsterData.movementSpeed,
        hover: parsedMonsterData.hover,
        units: 'ft',
      },
      attunement: {
        max: 0,
      },
      senses: {
        ...parsedMonsterData.senses,
        units: 'ft',
        special: '',
      },
      spellcasting: '',
    };
  }

  get details(): Foundry5eMonsterDetails {
    return {
      alignment: this.parsedMonsterData.alignment,
      type: {
        value: this.parsedMonsterData.type,
        subtype: this.parsedMonsterData.subtype,
        swarm: this.parsedMonsterData.isASwarm ? 'tiny' : '',
        custom: '',
      },
      cr: this.parsedMonsterData.challengeRating,
      source: 'AI Monster Importer',
      biography: {
        value: this.parsedMonsterData.biography,
        public: this.parsedMonsterData.biography,
      },
      race: this.parsedMonsterData.race,
      environment: this.parsedMonsterData.environment,
      spellLevel: 0,
    };
  }

  get traits(): Foundry5eMonsterTraits {
    // TODO - handle bypasses
    return {
      size: sizeToFoundrySize(this.parsedMonsterData.size),
      di: {
        value: this.parsedMonsterData.damageImmunities,
        bypasses: [],
        custom: '',
      },
      dr: {
        value: this.parsedMonsterData.damageResistances,
        bypasses: [],
        custom: '',
      },
      dv: {
        value: this.parsedMonsterData.damageVulnerabilities,
        bypasses: [],
        custom: '',
      },
      ci: {
        value: this.parsedMonsterData.conditionImmunities,
        custom: '',
      },
      languages: {
        value: this.parsedMonsterData.languages,
        custom: '',
      },
    };
  }

  get currency(): Foundry5eMonsterCurrency {
    return {
      cp: 0,
      sp: 0,
      ep: 0,
      gp: 0,
      pp: 0,
    };
  }
  // TODO - this is messy, uses Parse but might be the way to go
  get skills(): Foundry5eMonsterSkills {
    const skillMapping: { [key: string]: string } = {
      Athletics: 'ath',
      Acrobatics: 'acr',
      'Sleight of Hand': 'slt',
      Stealth: 'ste',
      Arcana: 'arc',
      History: 'his',
      Investigation: 'inv',
      Nature: 'nat',
      Religion: 'rel',
      'Animal Handling': 'ani',
      Insight: 'ins',
      Medicine: 'med',
      Perception: 'prc',
      Survival: 'sur',
      Deception: 'dec',
      Intimidation: 'itm',
      Performance: 'prf',
      Persuasion: 'per',
      // Add other mappings as necessary
    };

    console.log('this.parsedMonsterData.skills: ', this.parsedMonsterData.skills);

    const foundrySkills = {};
    this.parsedMonsterData.skills.forEach((skill) => {
      const skillAbbreviation = skillMapping[skill.name];
      if (!skillAbbreviation) return;

      const modifierValue = parseInt(skill.modifier, 10) || 0;
      foundrySkills[skillAbbreviation] = {
        value: modifierValue,
        ability: 'dex', // This should be set according to your game's logic
        bonuses: {
          check: '',
          passive: '',
        },
      };
    });

    console.log('foundrySkills: ', foundrySkills);

    return Foundry5eMonsterSkillsSchema.parse(foundrySkills);
  }

  // TODO - spell slot parsing
  get spells(): Foundry5eMonsterSpells {
    // TODO - boilerplate from gargoyle example for now
    return Foundry5eMonsterSpellsSchema.parse(gargoyleJSON.system.spells);
  }

  get bonuses(): Foundry5eMonsterBonuses {
    return Foundry5eMonsterBonusesSchema.parse(gargoyleJSON.system.bonuses);
  }

  get resources(): Foundry5eMonsterResources {
    return Foundry5eMonsterResourcesSchema.parse(gargoyleJSON.system.resources);
  }

  // get _stats(): FoundryMonsterStats {
  //   return FoundryMonsterStatsSchema.parse(gargoyleJSON._stats);
  // }
}

export default genFoundry5eMonster;
