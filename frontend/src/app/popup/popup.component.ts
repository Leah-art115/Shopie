import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  message = '';
  visible = false;

  constructor(private popupService: PopupService) {}

  ngOnInit() {
    this.popupService.popupState.subscribe((msg: string) => {
      this.message = msg;
      this.visible = true;
      setTimeout(() => this.visible = false, 3000);
    });
  }

  close() {
    this.visible = false;
  }
}
