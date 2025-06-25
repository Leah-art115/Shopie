import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private popupSubject = new Subject<string>();
  popupState = this.popupSubject.asObservable();

  show(message: string) {
    this.popupSubject.next(message);
  }
}
