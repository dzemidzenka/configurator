export enum ACTION {
    RAW = 'RAW',
    RESET = 'RESET',
    REQUIREMENT = 'REQUIREMENT',
    MATERIAL = 'MATERIAL',
    CONSIGNED = 'CONSIGNED'
};


export interface IActionModel {
    op: ACTION;
    raw?: Array<IConfiguratorDataModel>;
    currentMaterial?: string;
    requirement?: IRequirementsModel;
}


export interface IAvailModel {
    material: string;
    L: number;
    lordosis: number;
    partNumber: string;
    description: string;
}


export interface IStateModel {
    actions: Array<IActionModel>;
    raw: Array<IConfiguratorDataModel>;
    materials: Array<string>;
    L: Array<Number>;
    lordosis: Array<Number>;
    currentMaterial: string;
    consignedPresent: boolean;
    avail: Array<IAvailModel>;
    requirements: Array<IRequirementsModel>;
    setProposal: Array<ISetProposalModel>;
}

export interface IConfiguratorDataModel {
    setType: string;
    type: string;
    partNumber: string;
    description: string;
    material: string;
    H: number;
    L: number;
    W: number;
    lordosis: number;
    lordosisOrig?: number;
    qtyInSet: number;
}

export interface IRequirementMessageModel {
    L: number;
    lordosis: number;
    qty: number;
}

export interface IRequirementsModel extends IRequirementMessageModel {
    material: string;
    partNumber: string;
    description: string;
    avail: boolean;
    availMaterials: Array<string>;
    animationActive: boolean;
    excluded: boolean;
    setType: string;
    setTypeAdd: string;    
    qtyInSet: number;
    numberOfSets: number;
}

export interface ISetProposalModel {
    setType: string;
    qty: number;
    qtyInSet: number;
    animationActive: boolean;
} 