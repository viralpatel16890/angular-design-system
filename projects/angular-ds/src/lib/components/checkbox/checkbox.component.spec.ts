import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<CheckboxComponent>;
  let component: CheckboxComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render an input of type checkbox', () => {
    expect(fixture.debugElement.query(By.css('input[type="checkbox"]'))).toBeTruthy();
  });

  it('should be unchecked by default', () => {
    expect(component.checked()).toBe(false);
  });

  it('should apply default size class (md)', () => {
    expect(fixture.debugElement.query(By.css('.ds-checkbox-wrapper--md'))).toBeTruthy();
  });

  it('should seed checked state from [checked] input via ngOnInit', () => {
    fixture.componentRef.setInput('checked', true);
    component.ngOnInit();
    expect(component.checked()).toBe(true);
  });

  it('should not override writeValue-set state when checked input is false', () => {
    component.writeValue(true);
    fixture.componentRef.setInput('checked', false);
    component.ngOnInit();
    // defaultChecked is false so ngOnInit does not flip it back
    expect(component.checked()).toBe(true);
  });

  it('should implement writeValue (CVA) — sets checked signal', () => {
    component.writeValue(true);
    expect(component.checked()).toBe(true);
    component.writeValue(false);
    expect(component.checked()).toBe(false);
  });

  it('should call registered onChange callback when checkbox changes', () => {
    const changeSpy = vi.fn();
    component.registerOnChange(changeSpy);
    const inputEl = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement as HTMLInputElement;
    inputEl.checked = true;
    inputEl.dispatchEvent(new Event('change'));
    expect(changeSpy).toHaveBeenCalledWith(true);
  });

  it('should update checked signal when native checkbox changes', () => {
    const inputEl = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement as HTMLInputElement;
    inputEl.checked = true;
    inputEl.dispatchEvent(new Event('change'));
    expect(component.checked()).toBe(true);
  });

  it('should emit checkedChange output when checkbox changes', () => {
    const spy = vi.fn();
    component.checkedChange.subscribe(spy);
    const inputEl = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement as HTMLInputElement;
    inputEl.checked = true;
    inputEl.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should call registered onTouched callback on blur', () => {
    const spy = vi.fn();
    component.registerOnTouched(spy);
    fixture.debugElement.query(By.css('input')).nativeElement.dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalled();
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(inputEl.disabled).toBe(true);
  });

  it('should apply disabled class to wrapper when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-checkbox-wrapper--disabled'))).toBeTruthy();
  });

  it('should apply aria-required when required is true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.getAttribute('aria-required')).toBe('true');
  });

  it('should render helper text when helperText input is provided', () => {
    fixture.componentRef.setInput('helperText', 'Accept terms');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-checkbox__helper'))).toBeTruthy();
  });

  it('should generate a unique uid per instance', () => {
    const fixture2 = TestBed.createComponent(CheckboxComponent);
    expect(fixture2.componentInstance.uid).not.toBe(component.uid);
  });
});
