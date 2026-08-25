import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RadioGroupComponent } from './radio-group.component';
import { RadioComponent } from '../radio/radio.component';
import { FormErrorComponent } from '../form-error/form-error.component';

@Component({
  standalone: true,
  imports: [RadioGroupComponent, RadioComponent, FormsModule],
  template: `
    <ds-radio-group
      label="Plan"
      [required]="required"
      [disabled]="groupDisabled"
      [helperText]="helperText"
      [(ngModel)]="plan"
      (valueChange)="onChange($event)"
    >
      <ds-radio value="free" label="Free" />
      <ds-radio value="pro" label="Pro" [disabled]="proDisabled" />
      <ds-radio value="enterprise" label="Enterprise" />
    </ds-radio-group>
  `,
})
class HostComponent {
  plan = 'free';
  required = false;
  groupDisabled = false;
  proDisabled = false;
  helperText = '';
  onChange(_: string): void {}
}

describe('RadioGroupComponent + RadioComponent (composed)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const getGroup = (): RadioGroupComponent =>
    fixture.debugElement.query(By.directive(RadioGroupComponent)).componentInstance;

  const getRadioInputs = (): HTMLInputElement[] =>
    fixture.debugElement.queryAll(By.css('input[type="radio"]')).map(de => de.nativeElement);

  const checkAndFireChange = (input: HTMLInputElement): void => {
    // jsdom does not implement the browser's native "radio button group"
    // behavior (mutually-exclusive checking + roving tabindex + Arrow/Home/
    // End keyboard handling) — that behavior is provided by the browser
    // itself purely because every ds-radio in a group shares one native
    // `name`. This helper simulates the browser's own default action for a
    // radio activation (check it, then fire `change`), which is exactly
    // what a click *or* an Arrow-key press produces in a real browser.
    input.checked = true;
    input.dispatchEvent(new Event('change'));
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  // NgModel defers every writeValue() it drives — including the *initial*
  // one — through a resolved-promise microtask (to dodge
  // ExpressionChangedAfterItHasBeenCheckedError), so a plain synchronous
  // detectChanges() right after setting/changing the bound model won't yet
  // show it applied. A stabilize + second render pass is the standard way to
  // observe an ngModel-driven value in tests — see Angular's own NgModel
  // integration tests. `settleNgModel` below does exactly that.
  const settleNgModel = async (): Promise<void> => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('should create the group and render one radio per projected ds-radio', () => {
    expect(getGroup()).toBeTruthy();
    expect(getRadioInputs().length).toBe(3);
  });

  it('should seed the checked radio from the ngModel-bound initial value (CVA writeValue)', async () => {
    await settleNgModel();
    const inputs = getRadioInputs();
    expect(inputs[0].checked).toBe(true);
    expect(inputs[1].checked).toBe(false);
    expect(inputs[2].checked).toBe(false);
  });

  it('should share one native `name` across every radio in the group — this is what gives native roving-tabindex and Arrow/Home/End keyboard behavior for free, with no custom ARIA radiogroup keyboard handling', () => {
    const names = getRadioInputs().map(i => i.name);
    expect(new Set(names).size).toBe(1);
    expect(names[0]).toBe(getGroup().name);
  });

  it('should update the group value when a different radio is activated (click or native keyboard nav both fire the same `change` event)', () => {
    checkAndFireChange(getRadioInputs()[1]);
    fixture.detectChanges();
    expect(getGroup().value()).toBe('pro');
  });

  it('should keep only one radio checked at a time after selection changes', () => {
    checkAndFireChange(getRadioInputs()[2]);
    fixture.detectChanges();
    const inputs = getRadioInputs();
    expect(inputs[0].checked).toBe(false);
    expect(inputs[1].checked).toBe(false);
    expect(inputs[2].checked).toBe(true);
  });

  it('should emit valueChange with the newly selected value', () => {
    const spy = vi.spyOn(host, 'onChange');
    checkAndFireChange(getRadioInputs()[1]);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('pro');
  });

  it('should propagate selection back through ngModel (two-way binding)', () => {
    checkAndFireChange(getRadioInputs()[2]);
    fixture.detectChanges();
    expect(host.plan).toBe('enterprise');
  });

  it('should update writeValue()-driven CVA state when the bound model changes externally', async () => {
    host.plan = 'enterprise';
    fixture.detectChanges();
    await settleNgModel();
    const inputs = getRadioInputs();
    expect(inputs[2].checked).toBe(true);
    expect(inputs[0].checked).toBe(false);
  });

  it('should disable every native radio input when the group is disabled', () => {
    host.groupDisabled = true;
    fixture.detectChanges();
    const inputs = getRadioInputs();
    expect(inputs.every(i => i.disabled)).toBe(true);
  });

  it('should apply the disabled class to the fieldset when group-disabled', () => {
    host.groupDisabled = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-radio-group--disabled'))).toBeTruthy();
  });

  it('should ignore activation attempts while the group is disabled', () => {
    host.groupDisabled = true;
    fixture.detectChanges();
    getGroup().selectValue('pro');
    fixture.detectChanges();
    expect(getGroup().value()).toBe('free');
  });

  it('should disable only the targeted radio when disabled is set at the item level', () => {
    host.proDisabled = true;
    fixture.detectChanges();
    const inputs = getRadioInputs();
    expect(inputs[0].disabled).toBe(false);
    expect(inputs[1].disabled).toBe(true);
    expect(inputs[2].disabled).toBe(false);
  });

  it('should render the required marker on the legend when required is true', () => {
    host.required = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-radio-group__legend--required'))).toBeTruthy();
  });

  it('should render helper text when helperText input is provided', () => {
    host.helperText = 'Choose the plan that fits your team.';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-radio-group__helper')).nativeElement.textContent)
      .toContain('Choose the plan that fits your team.');
  });

  it('should pass errorId down to ds-form-error as its id', () => {
    const formError = fixture.debugElement.query(By.directive(FormErrorComponent));
    expect((formError.componentInstance as FormErrorComponent).id()).toBe(getGroup().errorId);
  });
});

describe('RadioGroupComponent (standalone CVA behavior)', () => {
  let fixture: ComponentFixture<RadioGroupComponent>;
  let component: RadioGroupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start with a null value', () => {
    expect(component.value()).toBeNull();
  });

  it('should implement writeValue (CVA) — sets the value signal', () => {
    component.writeValue('pro');
    expect(component.value()).toBe('pro');
  });

  it('should call registered onChange callback when selectValue is invoked', () => {
    const changeSpy = vi.fn();
    component.registerOnChange(changeSpy);
    component.selectValue('pro');
    expect(changeSpy).toHaveBeenCalledWith('pro');
  });

  it('should call registered onTouched callback via notifyTouched', () => {
    const spy = vi.fn();
    component.registerOnTouched(spy);
    component.notifyTouched();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call onChange again when selectValue is called with the already-selected value', () => {
    const changeSpy = vi.fn();
    component.writeValue('pro');
    component.registerOnChange(changeSpy);
    component.selectValue('pro');
    expect(changeSpy).not.toHaveBeenCalled();
  });

  it('should generate a unique uid/name per instance', () => {
    const fixture2 = TestBed.createComponent(RadioGroupComponent);
    expect(fixture2.componentInstance.uid).not.toBe(component.uid);
    expect(fixture2.componentInstance.name).not.toBe(component.name);
  });

  it('should not set aria-describedby when there is no helper text or error', () => {
    const fieldset = fixture.debugElement.query(By.css('fieldset')).nativeElement;
    expect(fieldset.getAttribute('aria-describedby')).toBeNull();
  });

  it('should link aria-describedby to the helper id when helper text is present', () => {
    fixture.componentRef.setInput('helperText', 'Pick one.');
    fixture.detectChanges();
    const fieldset = fixture.debugElement.query(By.css('fieldset')).nativeElement;
    expect(fieldset.getAttribute('aria-describedby')).toBe(component.helperId);
  });
});
