
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";

import { DataService } from './data.service';


@Injectable()
export class RouteResolverService implements Resolve<void> {

    constructor(
        private dataService: DataService
    ) { }


    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        if (route.queryParams['material']) {
            this.dataService.setCurrentMaterial(route.queryParams['material']);
        }
    }

}