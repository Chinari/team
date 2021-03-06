import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ProductFilters } from '../../../models/product-filters';
import { Item } from '../../../models/item';
import { Country } from '../../../models/country';
import { ProductType } from '../../../models/product-type';
import { Store } from '@ngrx/store';

import { ProductGetListRequestPayload } from '../../../models/product-get-list-request-payload';
import { ProductGetList } from '../../../state/product-store/product-store.action';
import { ProductStoreService } from '../../../services/product-store.service';
import { ProductStoreSelectors } from '../../../state/product-store/product-store.selector';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-advance-filter',
  templateUrl: './advance-filter.component.html',
  styleUrls: ['./advance-filter.component.scss']
})
export class AdvanceFilterComponent implements OnInit, OnDestroy {
  allFilterOptions: ProductFilters;
  selectedFilters: Item[] = [];
  selectedTypes: ProductType[] = [];
  selectedSizes: Item[] = [];
  selectedPrices: Item[] = [];
  selectedCountries: Country[] = [];
  allRegions: Item[] = [];
  selectedRegions: Item[] = [];
  allVarietals: Item[] = [];
  selectedVarietals: Item[] = [];
  productsList: any;
  totalProducts = 0;
  PageSize = [15, 30, 45, 60, 75, 90];
  SortBy = ['Price', 'Size', 'Type', 'Country', 'Region'];
  selectedPageSize = 15;
  navigationSubscription;

  constructor(public dataservice: DataService,
    private store: Store<ProductGetListRequestPayload>,
    private productStoreService: ProductStoreService,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router) {

      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.initialiseSearchFilter();
        }
      });
    this.store.select(ProductStoreSelectors.productGetListData)
      .subscribe(pgld => {
        this.productsList = pgld ? pgld.ListProduct : [];
        this.totalProducts = pgld ? pgld.TotalCount : 0;
        this.spinnerService.hide();
      });
  }

  ngOnInit() {
    this.initialiseSearchFilter();
  }

  initialiseSearchFilter() {
    if (this.dataservice.searchByText !== '') {
      this.selectedFilters = [{id: '001', value: this.dataservice.searchByText, isSelected: true}];
      this.getProductsByKeyword();
    } else if (this.dataservice.filtersAllData) {
      this.allFilterOptions = this.dataservice.filtersAllData;
      this.getAllSelectedFilters();
      this.getFilteredProducts();
    }
  }

  getAllSelectedFilters() {
    this.selectedTypes = this.getSelectedFilterOptions(this.allFilterOptions.type);
    this.selectedSizes = this.getSelectedFilterOptions(this.allFilterOptions.size);
    this.selectedPrices = this.getSelectedFilterOptions(this.allFilterOptions.price);

    if (this.allFilterOptions.countries.length > 0) {
      this.selectedCountries = this.getSelectedFilterOptions(this.allFilterOptions.countries);
      this.selectedRegions = this.getSelectedFilterOptions(this.allRegions);
    }

    this.selectedFilters = [...this.selectedTypes, ...this.selectedSizes, ...this.selectedPrices,
      ...this.selectedCountries, ...this.selectedRegions];
  }

  onSelectionChange(item) {
    item.isSelected = !item.isSelected;

    this.getAllSelectedFilters();
    this.getFilteredProducts();
  }

  onCountrySelectionChange(country: Country) {
    country.isSelected = !country.isSelected;

    if (country.isSelected) {
      this.allRegions = [...this.allRegions, ...country.regions];
    } else {
      country.regions.forEach(region => {
        const rindex = this.allRegions.indexOf(region);
        if (rindex !== -1) {
          this.allRegions.splice(rindex, 1);
        }
      });
    }

    this.getAllSelectedFilters();
    this.getFilteredProducts();
  }

  getSelectedFilterOptions(filterType): any[] {
    return filterType.filter(type => type.isSelected === true);
  }

  removeFilter(filter) {

    const index = this.selectedFilters.findIndex(item => item === filter);
    if (index !== -1) {
      this.selectedFilters.splice(index, 1);

      if (filter.id === '001') {
        this.dataservice.searchByText = '';
        this.getProductsByKeyword();
        return;
      }
    }

    const tindex = this.allFilterOptions.type.findIndex(item => item.value === filter.value);
    if (tindex !== -1) {
      this.allFilterOptions.type[tindex].isSelected = false;
      this.getAllSelectedFilters();
      this.getFilteredProducts();
      return;
    }

    const sindex = this.allFilterOptions.size.findIndex(item => item.value === filter.value);
    if (sindex !== -1) {
      this.allFilterOptions.size[sindex].isSelected = false;
      this.getAllSelectedFilters();
      this.getFilteredProducts();
      return;
    }

    const pindex = this.allFilterOptions.price.findIndex(item => item.value === filter.value);
    if (pindex !== -1) {
      this.allFilterOptions.price[pindex].isSelected = false;
      this.getAllSelectedFilters();
      this.getFilteredProducts();
    }

  }
  onPageSizeChange() {
    this.getFilteredProducts();
  }

  /* getFeatureProducts() {
    this.spinnerService.show();
    this.store.dispatch(new ProductGetList(
      this.productStoreService.getProductGetListParams(
        {
          isFeatured: this.dataservice.isFeatureProduct, pageSize: this.selectedPageSize
        }
      )));
  } */

  getProductsByKeyword() {
    this.spinnerService.show();
    this.store.dispatch(new ProductGetList(
      this.productStoreService.getProductGetListParams(
        {
          categoryId: this.dataservice.categoryId, pageSize: this.selectedPageSize, keyWord: this.dataservice.searchByText
        }
      )));
  }
  getFilteredProducts() {

    let types = '';
    let sizes = '';
    let countries = '';
    let regions = '';
    let minPrice = 0;
    let maxPrice = 0;

    if (this.selectedTypes && this.selectedTypes.length > 0) {
      types = this.selectedTypes.map((res: Item) => res.id).join(',');
    }
    if (this.selectedSizes && this.selectedSizes.length > 0) {
      sizes = this.selectedSizes.map((res: Item) => res.id).join(',');
    }
    if (this.selectedPrices && this.selectedPrices.length > 0) {
      const prices = this.selectedPrices.map((res: Item) => res.value);

      if (prices[0].match(/\d+/g)) {
        minPrice = prices[0].match(/\d+/g).map(Number)[0];
      }

      if (prices[prices.length - 1].match(/\d+/g) && prices[prices.length - 1].match(/\d+/g).length > 1) {
        maxPrice = prices[prices.length - 1].match(/\d+/g).map(Number)[1];
      } else {
        maxPrice = 99999;
      }
    }

    if (this.selectedCountries && this.selectedCountries.length > 0) {
      countries = this.selectedCountries.map((res: Item) => res.id).join(',');
    }

    if (this.selectedRegions && this.selectedRegions.length > 0) {
      regions = this.selectedRegions.map((res: Item) => res.id).join(',');
    }
    this.spinnerService.show();
    this.store.dispatch(new ProductGetList(
      this.productStoreService.getProductGetListParams(
        {
          categoryId: this.dataservice.categoryId, pageSize: this.selectedPageSize, typeId: types,
          sizeId: sizes, countryId: countries, regionId: regions,
          minPrice: minPrice, maxPrice: maxPrice, keyWord: this.dataservice.searchByText
        }
      )));
  }

  clearSearch() {
    this.allFilterOptions.type.map(type => type.isSelected = false);
    this.allFilterOptions.size.map(size => size.isSelected = false);
    this.allFilterOptions.price.map(price => price.isSelected = false);
    this.getAllSelectedFilters();
    this.getFilteredProducts();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
