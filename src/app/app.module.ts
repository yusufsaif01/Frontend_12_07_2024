import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angulartics2Module } from 'angulartics2';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
// import { HomeModule } from './home/home.module';
// import { ShellModule } from './shell/shell.module';
import { LoginModule } from './core/authentication/login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
// import { HomeComponent } from './pages/home/home.component';
import { LoginFrontendModule } from './login-frontend/login-frontend.module';
import { LoaderInterceptor } from './core/http/loader.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { FrontendModule } from './frontend/frontend.module';
import { ToastrModule } from 'ngx-toastr';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './core/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './core/authentication/reset-password/reset-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CreatePasswordComponent } from './core/authentication/create-password/create-password.component';
import { ProfileComponent } from './profile/profile.component';
import { MatSortModule } from '@angular/material/sort';
import { FeatherModule } from 'angular-feather';

import {
  Camera,
  Heart,
  Github,
  Users,
  Crosshair,
  MessageSquare,
  Bell,
  AlertCircle,
  Image,
  Delete,
  Trash2,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MapPin,
  Clock,
  Star,
  Edit
} from 'angular-feather/icons';
import { from } from 'rxjs';
import { TimelineComponent } from './timeline/timeline.component';
import { PostPopupComponent } from './post-popup/post-popup.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DeleteConfirmationComponent } from './shared/dialog-box/delete-confirmation/delete-confirmation.component';
import { StatusConfirmationComponent } from './shared/dialog-box/status-confirmation/status-confirmation.component';
import { AddEditPopupComponent } from './admin/masterdata/player-specialization/manage-position/add-edit-popup/add-edit-popup.component';
import { AddpopupComponent } from './admin/masterdata/player-specialization/addpopup/addpopup.component';
import { RoleGuardService } from './core/authentication/role-guard.service';
import { FootRequestComponent } from './foot-request/foot-request.component';
import { MutualFootmateComponent } from './foot-request/mutual-footmate/mutual-footmate.component';
import { FootMatesComponent } from './foot-mates/foot-mates.component';
import { JwtInterceptor } from './core/http/jwt.interceptor';
import { ErrorInterceptor } from './core/http/error.interceptor';
const icons = {
  Camera,
  Heart,
  Github,
  Users,
  Crosshair,
  MessageSquare,
  Bell,
  AlertCircle,
  Image,
  Delete,
  Trash2,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MapPin,
  Clock,
  Star
};

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', {
      enabled: environment.production
    }),
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    CarouselModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    CommonModule,
    // ShellModule,
    // HomeModule,
    LoginModule,
    LoginFrontendModule,
    FeatherModule.pick(icons),
    // FrontendModule,
    Angulartics2Module.forRoot(),
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    })
  ],
  declarations: [
    AppComponent,
    RegistrationComponent,
    EditProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    CreatePasswordComponent,
    ProfileComponent,
    TimelineComponent,
    PostPopupComponent,
    DeleteConfirmationComponent,
    StatusConfirmationComponent,
    AddEditPopupComponent,
    AddpopupComponent,
    FootRequestComponent,
    MutualFootmateComponent,
    FootMatesComponent
  ],
  providers: [
    RoleGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    PostPopupComponent,
    DeleteConfirmationComponent,
    StatusConfirmationComponent,
    AddEditPopupComponent,
    AddpopupComponent,
    MutualFootmateComponent
  ]
})
export class AppModule {}
