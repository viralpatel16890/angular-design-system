import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>;
  let component: AlertComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render with role="alert"', () => {
    expect(fixture.debugElement.query(By.css('[role="alert"]'))).toBeTruthy();
  });

  it('should hide itself when dismissed', () => {
    fixture.componentRef.setInput('message', 'Something happened');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.ds-alert__close')).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="alert"]'))).toBeNull();
  });
});
