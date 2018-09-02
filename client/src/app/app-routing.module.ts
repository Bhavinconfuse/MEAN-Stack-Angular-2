import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent} from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent} from './components/login/login.component';
import {  ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent} from './components/public-profile/public-profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { DeleteBlogComponent} from './components/blog/delete-blog/delete-blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard} from './guards/notAuth.guard';

// our array of angular 2 Routes
const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent // Default routes
    },
    {
        path: 'dashboard',
        component: DashboardComponent, // the dashboar droutes..
        canActivate: [AuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent, // The register component
        canActivate: [NotAuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent, // The login component
        canActivate: [NotAuthGuard]

    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'blog',
        component: BlogComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'edit-blog/:id',
        component: EditBlogComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'delete-blog/:id',
        component: DeleteBlogComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'user/:username',
        component: PublicProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        component: HomeComponent // The "Catch-All" Route
    },
];


@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
})
export class AppRoutingModule { }