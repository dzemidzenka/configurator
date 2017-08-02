import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configurator-button',
  templateUrl: './configurator-button.component.html',
  styleUrls: ['./configurator-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfiguratorButtonComponent implements OnInit, OnDestroy {

  qty: number = 0;
  reset$Subscription: Subscription;
  @Input() qtyAvail: number = 0;
  @Output() qtyChanged = new EventEmitter<number>();


  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.reset$Subscription = this.dataService.reset$.subscribe(
      () => {
        this.qty = 0;
        this.qtyChanged.emit(this.qty);
      }
    );
  }

  ngOnDestroy() {
    this.reset$Subscription.unsubscribe();
  }

  up() {
    if (this.qty === this.qtyAvail) {
      return;
    }
    this.qty++;
    this.qtyChanged.emit(this.qty);
  }

  down() {
    if (this.qty !== 0) {
      this.qty--;
      this.qtyChanged.emit(this.qty);
    }
  }

}
