export enum ACTION { 'RESET' };

export interface RequirementsModel {
    op?: ACTION;  
    L: number;
    lordosis: number;
    qty: number;
    qtyAvail?: number;
}  