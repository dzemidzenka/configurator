export enum ACTION { 'RAW', 'RESET', 'REQUIREMENT', 'MATERIAL' };

export interface ActionModel {
    op: ACTION;
    raw?: Array<ConfiguratorDataModel>;
    currentMaterial?: string;
    requirement?: RequirementsModel;
}

export interface StateModel {
    actions: Array<ActionModel>;
    raw: Array<ConfiguratorDataModel>;
    materials: Array<string>;
    L: Array<Number>;
    lordosis: Array<Number>;
    currentMaterial: string;
    requirements: Array<RequirementsModel>;
}

export interface ConfiguratorDataModel {
    setType: string;
    type: string;
    partNumber: string;
    description: string;
    material: string;
    available: number;
    H: number;
    L: number;
    W: number;
    lordosis: number;
    qtyInSet: number;
}

export interface RequirementsModel {
    L: number;
    lordosis: number;
    qty: number;
    qtyAvail?: number;
}

export interface SetProposalModel {
    setType: string;
    qty: number;
} 