import { InjectionToken } from '@angular/core';
import { IConfiguratorDataModel, ISetContentModel } from '../models/models';

export const DEFAULT_MATERIAL_PROVIDER = new InjectionToken<string>('defaultMaterial');
export const DATA_PROVIDER = new InjectionToken<Array<IConfiguratorDataModel>>('data');
export const SET_CONTENT_PROVIDER = new InjectionToken<Array<ISetContentModel>>('setContent');
export const LOCAL_STORAGE_NAME_PROVIDER = new InjectionToken<string>('localStorageName');

import { RAW_DATA } from '../../data/data';
import { SET_CONTENT_DATA } from '../../data/setContent';

const LOCAL_STORAGE_NAME = 'configurator_state';
const DEFAULT_MATERIAL = 'PEEK';
const DATA: Array<IConfiguratorDataModel> = RAW_DATA;
const SET_CONTENT: Array<ISetContentModel> = SET_CONTENT_DATA;

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
    provide: SET_CONTENT_PROVIDER,
    useValue: SET_CONTENT_DATA
  },
  {
    provide: LOCAL_STORAGE_NAME_PROVIDER,
    useValue: LOCAL_STORAGE_NAME
  }
];
