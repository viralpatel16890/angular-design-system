import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RadioComponent } from './radio.component';

describe('RadioComponent (standalone, no parent group)', () => {
  let fixture: ComponentFixture<RadioComponent>;
  let component: RadioComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 'a');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render an input of type radio', () => {
    expect(fixture.debugElement.query(By.css('input[type="radio"]'))).toBeTruthy();
  });

  it('should be unchecked when there is no parent group', () => {
    expect(component.checked()).toBe(false);
  });

  it('should fall back to its own uid as the native name when standalone', () => {
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(inputEl.name).toBe(component.uid);
  });

  it('should not throw when clicked without a parent group', () => {
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(() => inputEl.dispatchEvent(new Event('change'))).not.toThrow();
  });

  it('should apply default size class (md)', () => {
    expect(fixture.debugElement.query(By.css('.ds-radio-wrapper--md'))).toBeTruthy();
  });

  it('should be disabled when its own disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(inputEl.disabled).toBe(true);
  });

  it('should render label text when label input is provided', () => {
    fixture.componentRef.setInput('label', 'Option A');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-radio__label')).nativeElement.textContent).toContain('Option A');
  });

  it('should generate a unique uid per instance', () => {
    const fixture2 = TestBed.createComponent(RadioComponent);
    expect(fixture2.componentInstance.uid).not.toBe(component.uid);
  });
});
