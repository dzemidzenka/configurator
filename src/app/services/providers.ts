import { InjectionToken } from '@angular/core';
import { IConfiguratorDataModel } from '../models/models';
import { DATA, DEFAULT_MATERIAL } from '../app.data';

export const DEFAULT_MATERIAL_PROVIDER = new InjectionToken<string>('defaultMaterial');
export const DATA_PROVIDER = new InjectionToken<IConfiguratorDataModel>('data');
export const LOCAL_STORAGE_NAME_PROVIDER = new InjectionToken<string>('localStorageName');

const LOCAL_STORAGE_NAME = 'configurator_state';


// determine outliers
(function () {
    DATA.map(o => {
        o.lordosisOrig = o.lordosis;
        if (o.H === 14 || o.H === 16 || o.W === 40) {
            o.lordosis = 99;
        }
        return o;
    });
})();


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