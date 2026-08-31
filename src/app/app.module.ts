import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { configReducer } from './ThemeOptions/store/config.reducer.ngrx';
import { ConfigService } from './ThemeOptions/store/config.service';
import { environment } from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';

import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {AppComponent} from './app.component';
import {SpinnerComponent} from './spinner.component';

// BOOTSTRAP COMPONENTS
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Feature Modules
import { DashboardsModule } from './dashboards.module';
import { UserPagesModule } from './user-pages.module';
import { SharedModule } from './shared.module';

// LAYOUT
import {BaseLayoutComponent} from './Layout/base-layout/base-layout.component';
import {PagesLayoutComponent} from './Layout/pages-layout/pages-layout.component';

// HEADER
import {HeaderComponent} from './Layout/Components/header/header.component';

// SIDEBAR
import {SidebarComponent} from './Layout/Components/sidebar/sidebar.component';

// FOOTER
import {FooterComponent} from './Layout/Components/footer/footer.component';

// ThemeOptions
import {ThemeOptions} from './theme-options';

@NgModule({
  declarations: [
    // LAYOUT
    AppComponent,
    BaseLayoutComponent,
    PagesLayoutComponent,

    // HEADER
    HeaderComponent,

    // SIDEBAR
    SidebarComponent,

    // FOOTER
    FooterComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ config: configReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    CommonModule,

    // Angular Bootstrap Components
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Feature Modules
    SharedModule,
    DashboardsModule,
    UserPagesModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    ConfigService,
    ThemeOptions,
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
