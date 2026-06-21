import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button element', () => {
    expect(fixture.debugElement.query(By.css('button'))).toBeTruthy();
  });

  it('should apply the default variant class (primary)', () => {
    const btn = fixture.debugElement.query(By.css('.ds-btn--primary'));
    expect(btn).toBeTruthy();
  });

  it('should apply the default size class (md)', () => {
    const btn = fixture.debugElement.query(By.css('.ds-btn--md'));
    expect(btn).toBeTruthy();
  });

  it('should apply a different variant class when variant input changes', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-btn--secondary'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.ds-btn--primary'))).toBeNull();
  });

  it('should apply size class when size input changes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-btn--lg'))).toBeTruthy();
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.disabled).toBe(true);
  });

  it('should emit pressed event on click when not disabled', () => {
    const spy = vi.fn();
    component.pressed.subscribe(spy);
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should not emit pressed when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.pressed.subscribe(spy);
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should add loading class when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-btn--loading'))).toBeTruthy();
  });

  it('should disable the button when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.disabled).toBe(true);
  });

  it('should not emit pressed when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.pressed.subscribe(spy);
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should add full-width class when fullWidth is true', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-btn--full'))).toBeTruthy();
  });

  it('should set aria-label attribute when ariaLabel input is provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Submit form');
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.getAttribute('aria-label')).toBe('Submit form');
  });

  it('should set aria-busy when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.getAttribute('aria-busy')).toBe('true');
  });

  it('should set aria-disabled when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.getAttribute('aria-disabled')).toBe('true');
  });

  it('should include ds-btn base class in computed classes', () => {
    expect(component.classes()).toContain('ds-btn');
  });

  it('isDisabled computed should be true when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.isDisabled()).toBe(true);
  });

  it('isDisabled computed should be true when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(component.isDisabled()).toBe(true);
  });

  it('isDisabled computed should be false by default', () => {
    expect(component.isDisabled()).toBe(false);
  });
});
