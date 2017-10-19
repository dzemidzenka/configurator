export enum ACTION {
    RAW = 'RAW',
    RESET = 'RESET',
    REQUIREMENT = 'REQUIREMENT',
    MATERIAL = 'MATERIAL',
    CONSIGNED = 'CONSIGNED',
    REMEMBER = 'REMEMBER',
    COMPRESS = 'COMPRESS'
}

export interface IActionModel {
    op: ACTION;
    raw?: Array<IConfiguratorDataModel>;
    setContent?: Array<ISetContentModel>;
    currentMaterial?: string;
    requirement?: IRequirementsModel;
}

export interface IStateModel {
    actions: Array<IActionModel>;
    currentMaterial: string;
    raw: Array<IConfiguratorDataModel>;
    setContent: Array<ISetContentModel>;
    materials: Array<string>;
    W: Array<Number>;
    lordosis: Array<Number>;
    consignedPresent: boolean;
    requirements: Array<IRequirementsModel>;
    rememberSelections: boolean;
    compress: boolean;
}

export interface IConfiguratorDataModel {
    setType: string;
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
    W: number;
    lordosis: number;
    qty: number;
}

export interface IRequirementsModel extends IRequirementMessageModel {
    id: number;
    material: string;
    partNumber: string;
    description: string;
    avail: boolean;
    availMaterials: Array<string>;
    animationActive: boolean;
    excluded: boolean;
    setType: string;
    setTypeAdd: string;
    setContent: Array<ISetContentModel>;
    setContentAdd: Array<ISetContentModel>;
    qtyInSet: number;
    numberOfSets: number;
}

export interface ISetContentModel {
    setType: string;
    content: string;
}
