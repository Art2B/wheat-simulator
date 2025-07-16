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
}

export const RessourcesInformations: Record<Ressources, RessourceInformation> =
  {
    wheat: {
      materials: null,
      baseCraftTime: 1000,
    },
    parsnip: {
      materials: null,
      baseCraftTime: 1000,
    },
    bread: {
      materials: [
        {
          type: "wheat",
          quantity: 2,
        },
      ],
      baseCraftTime: 1000,
    },
  };
