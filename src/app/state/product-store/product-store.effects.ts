import { Injectable } from '@angular/core';

import { withLatestFrom, switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { RootStateModel } from '../../app.state';
import * as fromProductStore from '../product-store/product-store.action';
import { ProductStoreService } from '../../services/product-store.service';

@Injectable()
export class ProductStoreEffects {
    constructor(
        private actions$: Actions,
        private store: Store<RootStateModel>,
        private productStoreService: ProductStoreService) {
    }

    @Effect()
    getStoreHome$ = this.actions$
        .ofType(fromProductStore.ProductStoreActionTypes.StoreGetHome)
        .pipe(
            withLatestFrom<fromProductStore.StoreGetHome, RootStateModel>(this.store),
            switchMap(([action, state]) => {
                return this.productStoreService.getStoreHome().pipe(
                    map(p => {
                        return new fromProductStore.ProductStoreActions.StoreGetHomeSuccess(p);
                    }),
                    catchError(error =>
                        of(error)
                    )
                );
            })
        );
}