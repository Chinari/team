import { Action } from '@ngrx/store';
import { ProductGetListRequestPayload } from '../../models/product-get-list-request-payload';
import { ProductGetDetailsRequestPayload } from '../../models/product-get-details-request-payload';

export enum ProductStoreActionTypes {
    StoreGetHome = '[Store] StoreGetHome',
    StoreGetHomeSuccess = '[Store] StoreGetHomeSuccess',
    ProductGetList = '[Store] ProductGetList',
    ProductGetListSuccess = '[Store] ProductGetListSuccess',
    ProductGetDetails = '[Store] ProductGetDetails',
    ProductGetDetailsSuccess = '[Store] ProductGetDetailsSuccess'
}

export class StoreGetHome implements Action {
    readonly type = ProductStoreActionTypes.StoreGetHome;

    constructor() { }
}

export class StoreGetHomeSuccess implements Action {
    readonly type = ProductStoreActionTypes.StoreGetHomeSuccess;

    constructor(public payload: any) { }
}

export class ProductGetList implements Action {
    readonly type = ProductStoreActionTypes.ProductGetList;

    constructor(public payload: ProductGetListRequestPayload) { }
}

export class ProductGetListSuccess implements Action {
    readonly type = ProductStoreActionTypes.ProductGetListSuccess;

    constructor(public payload: any) { }
}

export class ProductGetDetails implements Action {
    readonly type = ProductStoreActionTypes.ProductGetDetails;

    constructor(public payload: ProductGetDetailsRequestPayload) { }
}

export class ProductGetDetailsSuccess implements Action {
    readonly type = ProductStoreActionTypes.ProductGetDetailsSuccess;

    constructor(public payload: any) { }
}

export const ProductStoreActions = {
    StoreGetHome,
    StoreGetHomeSuccess,
    ProductGetList,
    ProductGetListSuccess,
    ProductGetDetails,
    ProductGetDetailsSuccess
};

export type ProductStoreAction = StoreGetHome |
StoreGetHomeSuccess |
ProductGetList |
ProductGetListSuccess |
ProductGetDetails |
ProductGetDetailsSuccess;
