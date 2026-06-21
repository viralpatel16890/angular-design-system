import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent>;
  let component: InputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render an input element', () => {
    expect(fixture.debugElement.query(By.css('input'))).toBeTruthy();
  });

  it('should have type="text" by default', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('should render a wrapper with the default classes', () => {
    expect(fixture.debugElement.query(By.css('.ds-input-wrapper'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.ds-input-wrapper--md'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.ds-input-wrapper--default'))).toBeTruthy();
  });

  it('should apply error status class to wrapper', () => {
    fixture.componentRef.setInput('status', 'error');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-input-wrapper--error'))).toBeTruthy();
  });

  it('should apply success status class to wrapper', () => {
    fixture.componentRef.setInput('status', 'success');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-input-wrapper--success'))).toBeTruthy();
  });

  it('should set aria-invalid on input when status is error', () => {
    fixture.componentRef.setInput('status', 'error');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should apply disabled class to wrapper when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-input-wrapper--disabled'))).toBeTruthy();
  });

  it('should render label when label input is provided', () => {
    fixture.componentRef.setInput('label', 'Email address');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.ds-input-label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('Email address');
  });

  it('should render helper text when helperText input is provided', () => {
    fixture.componentRef.setInput('helperText', 'Enter a valid email');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-input-helper'))).toBeTruthy();
  });

  it('should apply focused class to wrapper on focus event', () => {
    fixture.debugElement.query(By.css('input')).nativeElement.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-input-wrapper--focused'))).toBeTruthy();
  });

  it('should remove focused class after blur', () => {
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-input-wrapper--focused'))).toBeNull();
  });

  it('should update value signal on input event', () => {
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    inputEl.value = 'hello';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.value()).toBe('hello');
  });

  it('should emit valueChange output on input event', () => {
    const spy = vi.fn();
    component.valueChange.subscribe(spy);
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    inputEl.value = 'world';
    inputEl.dispatchEvent(new Event('input'));
    expect(spy).toHaveBeenCalledWith('world');
  });

  it('should implement writeValue (CVA) — sets value signal', () => {
    component.writeValue('preset value');
    expect(component.value()).toBe('preset value');
  });

  it('writeValue with null/undefined should default to empty string', () => {
    component.writeValue(null as unknown as string);
    expect(component.value()).toBe('');
  });

  it('should call registered onChange callback when value changes via input event', () => {
    const changeSpy = vi.fn();
    component.registerOnChange(changeSpy);
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    inputEl.value = 'abc';
    inputEl.dispatchEvent(new Event('input'));
    expect(changeSpy).toHaveBeenCalledWith('abc');
  });

  it('should call registered onTouched callback on blur', () => {
    const touchedSpy = vi.fn();
    component.registerOnTouched(touchedSpy);
    fixture.debugElement.query(By.css('input')).nativeElement.dispatchEvent(new Event('blur'));
    expect(touchedSpy).toHaveBeenCalled();
  });

  it('should generate a unique uid per instance', () => {
    const fixture2 = TestBed.createComponent(InputComponent);
    expect(fixture2.componentInstance.uid).not.toBe(component.uid);
  });
});
