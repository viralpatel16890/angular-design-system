import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SelectComponent } from './select.component';

const OPTIONS = [
  { label: 'Angular', value: 'angular' },
  { label: 'React',   value: 'react' },
  { label: 'Vue',     value: 'vue', disabled: true },
];

describe('SelectComponent', () => {
  let fixture: ComponentFixture<SelectComponent>;
  let component: SelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start with the dropdown closed', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should open the dropdown on open()', () => {
    component.open();
    expect(component.isOpen()).toBe(true);
  });

  it('should close the dropdown on close()', () => {
    component.open();
    component.close();
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle open/closed on toggle()', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should not open when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.open();
    expect(component.isOpen()).toBe(false);
  });

  it('should set selectedValue on select()', () => {
    component.select(OPTIONS[0]);
    expect(component.selectedValue()).toBe('angular');
  });

  it('should not select a disabled option', () => {
    component.select(OPTIONS[2]); // Vue is disabled
    expect(component.selectedValue()).toBeNull();
  });

  it('should close dropdown after selecting an option', () => {
    component.open();
    component.select(OPTIONS[0]);
    expect(component.isOpen()).toBe(false);
  });

  it('should call registered onChange callback when option selected', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);
    component.select(OPTIONS[1]);
    expect(spy).toHaveBeenCalledWith('react');
  });

  it('should emit valueChange output when option selected', () => {
    const spy = vi.fn();
    component.valueChange.subscribe(spy);
    component.select(OPTIONS[0]);
    expect(spy).toHaveBeenCalledWith('angular');
  });

  it('should implement writeValue (CVA) — sets selectedValue signal', () => {
    component.writeValue('react');
    expect(component.selectedValue()).toBe('react');
  });

  it('writeValue with null should set selectedValue to null', () => {
    component.writeValue('angular');
    component.writeValue(null as unknown as string);
    expect(component.selectedValue()).toBeNull();
  });

  it('should compute selectedLabel based on selectedValue', () => {
    component.writeValue('angular');
    expect(component.selectedLabel()).toBe('Angular');
  });

  it('selectedLabel should be null when no value selected', () => {
    expect(component.selectedLabel()).toBeNull();
  });

  it('selectedLabel should be null when value does not match any option', () => {
    component.writeValue('unknown');
    expect(component.selectedLabel()).toBeNull();
  });

  it('should set activeIndex to 0 when opening with no selection', () => {
    component.open();
    expect(component.activeIndex()).toBe(0);
  });

  it('should set activeIndex to selected option index when opening', () => {
    component.writeValue('react');
    component.open();
    expect(component.activeIndex()).toBe(1);
  });

  it('should reset activeIndex to -1 when closed', () => {
    component.open();
    component.close();
    expect(component.activeIndex()).toBe(-1);
  });

  it('should call onTouched when closed', () => {
    const spy = vi.fn();
    component.registerOnTouched(spy);
    component.open();
    component.close();
    expect(spy).toHaveBeenCalled();
  });

  it('should apply disabled class to trigger when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.triggerClasses()).toContain('ds-select__trigger--disabled');
  });

  it('should apply open class to trigger when open', () => {
    component.open();
    expect(component.triggerClasses()).toContain('ds-select__trigger--open');
  });

  it('should handle Escape keydown to close the dropdown', () => {
    component.open();
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onTriggerKeydown(event);
    expect(component.isOpen()).toBe(false);
  });

  it('should handle ArrowDown keydown to open the dropdown', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    component.onTriggerKeydown(event);
    expect(component.isOpen()).toBe(true);
  });

  it('should handle Enter keydown to open the dropdown when closed', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onTriggerKeydown(event);
    expect(component.isOpen()).toBe(true);
  });
});
