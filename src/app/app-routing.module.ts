import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import { HomepageComponent } from './pages/home/homepage/homepage.component';
import { AboutusComponent } from './pages/aboutus/aboutuscomponent';
import { RecipesComponent } from './pages/recipe/recipes/recipes.component';
import { RecipeDetailsComponent } from './pages/recipe/recipe-details/recipe-details.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { EventDetailsComponent } from './pages/products/event-details/event-details.component';
import { MyAccountComponent } from './pages/myaccount/myaccount.component';
import { MyOrdersComponent } from './pages/myaccount/myorders/myorders.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdvanceFilterComponent } from './pages/products/advance-filter/advance-filter.component';
import { LoginComponent } from './pages/login/login.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { FeatureProductsComponent } from './pages/products/feature-products/feature-products.component';
import { EventsComponent } from './pages/products/events/events.component';

import { AuthGuard } from './auth.guard';
import { GeneralGuard } from './general.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent, runGuardsAndResolvers: 'always' },
  { path: 'about', component: AboutusComponent },
  { path: 'login', component: LoginComponent },
  { path: 'feature-products', component: FeatureProductsComponent, canActivate: [GeneralGuard]},
  { path: 'recipes', component: RecipesComponent, canActivate: [GeneralGuard]},
  { path: 'recipe-details/:id', component: RecipeDetailsComponent, canActivate: [GeneralGuard] },
  { path: 'product-details/:id', component: ProductDetailsComponent, canActivate: [GeneralGuard] },
  { path: 'event-details/:id', component: EventDetailsComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'myaccount', loadChildren: './pages/myaccount/myaccount.module#MyAccountModule', canActivate: [AuthGuard] },
  { path: 'myorders', component: MyOrdersComponent, canActivate: [AuthGuard]},
  { path: 'advance-filter', component: AdvanceFilterComponent, runGuardsAndResolvers: 'always' , canActivate: [GeneralGuard] },
  { path: 'beer', component: AdvanceFilterComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'liquor', component: AdvanceFilterComponent, runGuardsAndResolvers: 'always' , canActivate: [GeneralGuard]},
  { path: 'wine', component: AdvanceFilterComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'mixers-more', component: AdvanceFilterComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: 'cart', component: CartComponent, canActivate: [GeneralGuard]  },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'coupons', component: CouponsComponent, canActivate: [GeneralGuard] },
  { path: 'events', component: EventsComponent, runGuardsAndResolvers: 'always', canActivate: [GeneralGuard] },
  { path: '**', component: HomepageComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true,
    scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload'}), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
