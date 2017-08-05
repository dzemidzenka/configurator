import { ConfiguratorDataModel } from './data.model';
import { RequirementsModel } from './requirements.model';

export interface StateModel {
    raw: Array<ConfiguratorDataModel>;
    materials: Array<string>;
    L: Array<Number>;
    lordosis: Array<Number>;
    currentMaterial: string;
    requirements: Array<RequirementsModel>;    
}  

