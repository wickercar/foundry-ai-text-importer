import { ActivationType } from '../../schemas/enums/ActivationType';
import { BasicItemType } from '../../schemas/enums/BasicItemType';
import { Foundry5eItem, Foundry5eItemSchema } from '../../schemas/foundry/item/Foundry5eItem';
import { Parsed5eMonsterBasicItem } from '../../schemas/parsed-input-data/monster/Parsed5eMonsterBasicItem';

// Produces an item where most fields are default values, but the name and description are taken from the input
export const genCustomBoilerplateFoundry5eItemFromBasicItem = ({
  name,
  text,
  type,
}: Parsed5eMonsterBasicItem): Foundry5eItem => {
  // TODO - this is boilerplate for now, just replacing name and description with name and text. Will want to make it a just holding it here to finish the foundry import piece
  const activationType = activationTypeFromBasicItemType(type);

  const item = Foundry5eItemSchema.parse({
    name,
    type: 'weapon',
    img: '',
    system: {
      description: {
        value: `<p>${text}</p>`,
        chat: '',
        unidentified: '',
      },
      source: 'AI Monster Importer',
      quantity: 1,
      weight: 0,
      price: { value: 0, denomination: 'gp' },
      attunement: 0,
      equipped: true,
      rarity: '',
      identified: true,
      activation: { type: activationType, cost: 1, condition: '' },
      duration: { value: '', units: '' },
      cover: null,
      target: { value: null, width: null, units: '', type: '' },
      range: { value: 5, long: null, units: 'ft' },
      uses: { value: null, max: '', per: null, recovery: '' },
      consume: { type: '', target: null, amount: null },
      ability: 'str',
      actionType: 'mwak',
      attackBonus: '',
      chatFlavor: '',
      critical: { threshold: null, damage: '' },
      damage: { parts: [], versatile: '' },
      formula: '',
      save: { ability: '', dc: null, scaling: 'spell' },
      armor: { value: 10 },
      hp: { value: 0, max: 0, dt: null, conditions: '' },
      weaponType: 'natural',
      baseItem: '',
      properties: {
        amm: false,
        fin: false,
        fir: false,
        foc: false,
        hvy: false,
        lgt: false,
        lod: false,
        rch: false,
        rel: false,
        ret: false,
        spc: false,
        thr: false,
        two: false,
        ver: false,
      },
      proficient: true,
    },
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {
      core: { sourceId: '' },
    },
    // _stats: {
    //   systemId: null,
    //   systemVersion: null,
    //   coreVersion: null,
    //   createdTime: null,
    //   modifiedTime: null,
    //   lastModifiedBy: null
    // }
  });

  return item;
};

const activationTypeFromBasicItemType = (type: BasicItemType): ActivationType => {
  switch (type) {
    case 'action':
      return 'action';
    case 'reaction':
      return 'reaction';
    case 'legendaryAction':
      return 'legendary';
    case 'specialTrait':
      return 'special';
    default:
      return 'action';
  }
};
