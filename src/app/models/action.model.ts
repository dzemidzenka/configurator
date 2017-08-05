import { ConfiguratorDataModel } from '../models/data.model';
import { RequirementsModel } from './requirements.model';

export enum ACTION { 'RESET', 'RAW', 'REQUIREMENT', 'MATERIAL' };

export interface ActionModel {    
    op: ACTION;
    raw?: Array<ConfiguratorDataModel>; 
    currentMaterial?: string;
    requirement?: RequirementsModel;    
}  