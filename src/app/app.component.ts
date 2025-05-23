// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'wellness-poc';
// }


import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingService } from './loading/loading.service';
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
})
export class AppComponent {
 constructor(private router: Router, private loading: LoadingService) {
   this.router.events.subscribe(event => {
     if (event instanceof NavigationStart) {
       this.loading.show();
     }
     if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
       this.loading.hide();
     }
   });
 }
}