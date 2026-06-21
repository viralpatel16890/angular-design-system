import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToggleComponent } from './toggle.component';

describe('ToggleComponent', () => {
  let fixture: ComponentFixture<ToggleComponent>;
  let component: ToggleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render an input with role="switch"', () => {
    expect(fixture.debugElement.query(By.css('input[role="switch"]'))).toBeTruthy();
  });

  it('should start unchecked by default', () => {
    expect(component.checked()).toBe(false);
  });

  it('should apply default size class (md)', () => {
    expect(fixture.debugElement.query(By.css('.ds-toggle-wrapper--md'))).toBeTruthy();
  });

  it('should seed checked state from [checked] input via ngOnInit', () => {
    fixture.componentRef.setInput('checked', true);
    component.ngOnInit();
    expect(component.checked()).toBe(true);
  });

  it('should toggle checked state from false to true on toggle()', () => {
    expect(component.checked()).toBe(false);
    component.toggle();
    expect(component.checked()).toBe(true);
  });

  it('should toggle checked state from true to false on second toggle()', () => {
    component.toggle();
    component.toggle();
    expect(component.checked()).toBe(false);
  });

  it('should not toggle when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.toggle();
    expect(component.checked()).toBe(false);
  });

  it('should call registered onChange callback when toggled', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);
    component.toggle();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit checkedChange output on toggle', () => {
    const spy = vi.fn();
    component.checkedChange.subscribe(spy);
    component.toggle();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should implement writeValue (CVA) — sets checked signal', () => {
    component.writeValue(true);
    expect(component.checked()).toBe(true);
    component.writeValue(false);
    expect(component.checked()).toBe(false);
  });

  it('should call registered onTouched on blur', () => {
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
    expect(fixture.debugElement.query(By.css('.ds-toggle-wrapper--disabled'))).toBeTruthy();
  });

  it('should set aria-checked attribute to reflect checked state', () => {
    fixture.detectChanges();
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.getAttribute('aria-checked')).toBe('false');
    component.toggle();
    fixture.detectChanges();
    expect(inputEl.getAttribute('aria-checked')).toBe('true');
  });

  it('should render label when label input is provided', () => {
    fixture.componentRef.setInput('label', 'Dark mode');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.ds-toggle__label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('Dark mode');
  });

  it('should render helper text when helperText is provided', () => {
    fixture.componentRef.setInput('helperText', 'Toggle to switch modes');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-toggle__helper'))).toBeTruthy();
  });
});
