import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { CustomerService } from './customer.service';
import { baseUrl, UrlNames } from './url-provider';
import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { StoreGetHome } from '../state/product-store/product-store.action';
import { ProductGetListRequestPayload } from '../models/product-get-list-request-payload';
import { ProductGetDetailsRequestPayload } from '../models/product-get-details-request-payload';
import { EventGetDetailsRequestPayload } from '../models/event-get-details-request-payload';
import { FavoriteProductUpdateRequestPayload } from '../models/favorite-product-update-payload';

@Injectable()
export class ProductStoreService {
    headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    customerSession: CustomerLoginSession;

    constructor(private http: HttpClient, private store: Store<CustomerLoginSession>, private customerService: CustomerService) {
        this.store.select(CustomerSelectors.customerLoginSessionData)
            .subscribe(clsd => {
                if (clsd) {
                    this.customerSession = clsd;
                    this.store.dispatch(new StoreGetHome());
                }
            });
    }

    getStoreHome(): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.GetStoreHome, this.getStoreObject()).pipe(
            switchMap((res: any) => {
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return this.processError(error);
            })
        );
    }

    private getStoreObject(): any {
        if (!this.customerSession) {
            return null;
        }

        return {
            StoreId: this.customerSession.StoreId,
            SessionId: this.customerSession.SessionId,
            UserId: this.customerSession.UserId,
            AppId: this.customerSession.AppId,
            IsFeatureProduct: true
        };
    }

    productGetList(reqParams: ProductGetListRequestPayload): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.ProductGetList, reqParams, { headers: this.headers }).pipe(
            switchMap((res: any) => {
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return this.processError(error);
            })
        );
    }

    getProductGetListParams({ pageSize = 12, pageNumber = 1, isClub = 0,
        categoryId = '1,2,3,4', sizeId = '',
        typeId = '', varietalId = 0, countryId = 0,
        regionId = 0, isFavorite = 0, isFeatured = 1,
        maxPrice = 0, minPrice = 0, keyWord = '',
        deviceId = '610201801@mk.com'
    }:
        {
            pageSize?: number, pageNumber?: number, isClub?: number,
            categoryId?: string, sizeId?: string,
            typeId?: string, varietalId?: number, countryId?: number,
            regionId?: number, isFavorite?: number, isFeatured?: number,
            maxPrice?: number, minPrice?: number, keyWord?: string,
            deviceId?: string
        } = {}) {

        if (!this.customerSession) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            AppId: this.customerSession.AppId,
            PageSize: pageSize,
            PageNumber: pageNumber,
            IsClub: isClub,
            CategoryId: categoryId,
            SessionId: this.customerSession.SessionId,
            UserId: this.customerSession.UserId,
            SizeId: sizeId,
            TypeId: typeId,
            VarietalId: varietalId,
            CountryId: countryId,
            RegionId: regionId,
            IsFavorite: isFavorite,
            IsFeatured: isFeatured,
            MaxPrice: maxPrice,
            MinPrice: minPrice,
            KeyWord: keyWord,
            DeviceId: this.customerSession.DeviceId,
            DeviceType: this.customerSession.DeviceType
        };
    }

    productGetDetails(reqParams: ProductGetDetailsRequestPayload): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.ProductGetDetails, reqParams, { headers: this.headers }).pipe(
            switchMap((res: any) => {
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return this.processError(error);
            })
        );
    }

    getProductGetDetailsParams(pid: number): ProductGetDetailsRequestPayload {
        if (!this.customerSession) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            UserId: this.customerSession.UserId,
            SessionId: this.customerSession.SessionId,
            AppId: this.customerSession.AppId,
            PID: pid
        };
    }

    eventGetDetails(reqParams: EventGetDetailsRequestPayload): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.EventGetDetails, reqParams, { headers: this.headers }).pipe(
            switchMap((res: any) => {
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return this.processError(error);
            })
        );
    }

    getEventGetDetailsParams(eid: number): EventGetDetailsRequestPayload {
        if (!this.customerSession) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            UserId: this.customerSession.UserId,
            SessionId: this.customerSession.SessionId,
            AppId: this.customerSession.AppId,
            EventID: eid
        };
    }

    favoriteProductUpdate(productId: number, favStatus: boolean): Observable<any> {
        return this.http.post<any>(baseUrl + UrlNames.FavoriteProductUpdate, this.getFavoriteUpdateObject(productId, favStatus));
    }

    getFavoriteUpdateObject(productId: number, favStatus: boolean): FavoriteProductUpdateRequestPayload {
        if (!this.customerSession) {
            return null;
        }
        return {
            StoreId: this.customerSession.StoreId,
            UserId: this.customerSession.UserId,
            SessionId: this.customerSession.SessionId,
            AppId: this.customerSession.AppId,
            PID: productId,
            FavoriteStatus: favStatus
        };
    }

    processError(error: any): Observable<any> {
        if (error.status && error.status === 401) {
            return EMPTY;
        }
        return throwError(error);
    }
}
