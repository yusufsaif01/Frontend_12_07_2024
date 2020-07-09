import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPassword]'
})
export class PasswordDirective {
  private passwordShown = false;

  constructor(private el: ElementRef) {
    this.setup();
  }

  toggle(icon: HTMLElement) {
    this.passwordShown = !this.passwordShown;
    if (this.passwordShown) {
      this.el.nativeElement.setAttribute('type', 'text');
      icon.innerHTML = 'visibility';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      icon.innerHTML = 'visibility_off';
    }
  }

  setup() {
    const parent = this.el.nativeElement.parentNode;
    const icon = document.createElement('mat-icon');
    icon.innerHTML = `visibility_off`;
    icon.setAttribute('class', 'material-icons');
    icon.addEventListener('click', (event: any) => {
      this.toggle(icon);
    });
    parent.appendChild(icon);
  }
}
