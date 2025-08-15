enum RESSOURCES {
  wheat,
  parsnip,
  bread,
}
export type Ressources = keyof typeof RESSOURCES;

interface CraftingRequirement {
  type: Ressources;
  quantity: number;
}

export interface RessourceInformation {
  materials: CraftingRequirement[] | null;
  baseCraftTime: number;
  farmable: boolean;
}

type RessourcesInformationsCollection = Record<
  Ressources,
  RessourceInformation
>;

export const RessourcesInformations: Record<Ressources, RessourceInformation> =
  {
    wheat: {
      materials: null,
      baseCraftTime: 1000,
      farmable: true,
    },
    parsnip: {
      materials: null,
      baseCraftTime: 1000,
      farmable: true,
    },
    bread: {
      materials: [
        {
          type: "wheat",
          quantity: 2,
        },
      ],
      baseCraftTime: 1000,
      farmable: false,
    },
  };

export class RessourceHelpers {
  static isRessource(key: string): boolean {
    return key in RESSOURCES;
  }

  static isPlantableRessource(key: string): boolean {
    return (
      key in RESSOURCES && RessourcesInformations[key as Ressources].farmable
    );
  }

  static isCraftableRessource(key: string): boolean {
    return (
      key in RESSOURCES &&
      Boolean(RessourcesInformations[key as Ressources].materials)
    );
  }

  static getRessourceFromString(key: string | undefined): Ressources | null {
    if (key && RessourceHelpers.isRessource(key)) {
      return key as Ressources;
    }

    return null;
  }
}

export const CraftableRessourcesInformations: Partial<RessourcesInformationsCollection> =
  Object.entries(RessourcesInformations)
    .filter(([key]) => {
      return RessourceHelpers.isCraftableRessource(key);
    })
    .reduce<Partial<RessourcesInformationsCollection>>((acc, [key, value]) => {
      const ressource = RessourceHelpers.getRessourceFromString(key);
      if (ressource) {
        acc[ressource] = value;
      }
      return acc;
    }, {});
