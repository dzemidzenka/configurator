import { InjectionToken } from '@angular/core';
import { IConfiguratorDataModel } from '../models/models';

export const DEFAULT_MATERIAL_PROVIDER = new InjectionToken<string>('defaultMaterial');
export const DATA_PROVIDER = new InjectionToken<IConfiguratorDataModel>('data');
export const LOCAL_STORAGE_NAME_PROVIDER = new InjectionToken<string>('localStorageName');

import { RAW_DATA } from '../../data/data';

const LOCAL_STORAGE_NAME = 'configurator_state';
const DEFAULT_MATERIAL = 'PEEK';
const DATA: Array<IConfiguratorDataModel> = RAW_DATA;

// // determine outliers
// (function () {
//     DATA.map(o => {
//         o.lordosisOrig = o.lordosis;
//         if (o.H === 14 || o.H === 16 || o.W === 40) {
//             o.lordosis = 99;
//         }
//         return o;
//     });
// })();


export const PROVIDERS = [
    {
        provide: DEFAULT_MATERIAL_PROVIDER,
        useValue: DEFAULT_MATERIAL
    },
    {
        provide: DATA_PROVIDER,
        useValue: DATA
    },
    {
        provide: LOCAL_STORAGE_NAME_PROVIDER,
        useValue: LOCAL_STORAGE_NAME
    }
]