import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastContainerComponent } from './toast-container.component';
import { ToastService } from './toast.service';

describe('ToastContainerComponent', () => {
  let fixture: ComponentFixture<ToastContainerComponent>;
  let component: ToastContainerComponent;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    toastService = component.toastService;
  });

  afterEach(() => fixture.destroy());

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should mark the container as a polite, non-atomic live region', () => {
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.ds-toast-container')).nativeElement;
    expect(container.getAttribute('role')).toBe('region');
    expect(container.getAttribute('aria-label')).toBe('Notifications');
    expect(container.getAttribute('aria-live')).toBe('polite');
    expect(container.getAttribute('aria-atomic')).toBe('false');
  });

  it('should mark each toast as an assertive, atomic alert region', () => {
    toastService.show('Something happened');
    fixture.detectChanges();

    const toastEl = fixture.debugElement.query(By.css('.ds-toast')).nativeElement;
    expect(toastEl.getAttribute('role')).toBe('alert');
    expect(toastEl.getAttribute('aria-live')).toBe('assertive');
    expect(toastEl.getAttribute('aria-atomic')).toBe('true');
  });
});
