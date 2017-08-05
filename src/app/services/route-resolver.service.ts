
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";

// import { DataService } from './data.service';


@Injectable()
export class RouteResolverService implements Resolve<void> {

    constructor(
        // private dataService: DataService,
        private router: Router,

    ) {
        console.log('resolver');
    }


    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        console.log('resolver redirect');
        this.router.navigate(['/configurator', 'peek']);

        // if (route.queryParams['material']) {
        //     this.dataService.setCurrentMaterial(route.queryParams['material']);
        // }
    }

}