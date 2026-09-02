import { NgModule } from '@angular/core';
import { SharedModule } from './shared.module';

// User Pages Components
import { ForgotPasswordBoxedComponent } from './Pages/UserPages/forgot-password-boxed/forgot-password-boxed.component';
import { LoginBoxedComponent } from './Pages/UserPages/login-boxed/login-boxed.component';

@NgModule({
  declarations: [
    ForgotPasswordBoxedComponent,
    LoginBoxedComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    ForgotPasswordBoxedComponent,
    LoginBoxedComponent
  ]
})
export class UserPagesModule { }
