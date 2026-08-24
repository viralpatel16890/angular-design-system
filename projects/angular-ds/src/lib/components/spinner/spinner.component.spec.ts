import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let fixture: ComponentFixture<SpinnerComponent>;
  let component: SpinnerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the ds-spinner base class', () => {
    expect(fixture.debugElement.query(By.css('.ds-spinner'))).toBeTruthy();
  });

  it('should render an svg icon', () => {
    expect(fixture.debugElement.query(By.css('.ds-spinner__icon'))).toBeTruthy();
  });

  it('should default to the md size class', () => {
    expect(fixture.debugElement.query(By.css('.ds-spinner--md'))).toBeTruthy();
  });

  it('should apply the sm size class when size input is sm', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-spinner--sm'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.ds-spinner--md'))).toBeNull();
  });

  it('should apply the lg size class when size input is lg', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-spinner--lg'))).toBeTruthy();
  });

  it('should be aria-hidden and have no role by default (decorative)', () => {
    const root = fixture.debugElement.query(By.css('.ds-spinner'));
    expect(root.nativeElement.getAttribute('aria-hidden')).toBe('true');
    expect(root.nativeElement.getAttribute('role')).toBeNull();
  });

  it('should NOT render visually-hidden text by default', () => {
    expect(fixture.debugElement.query(By.css('.ds-sr-only'))).toBeNull();
  });

  it('should expose role="status" and drop aria-hidden when a label is provided', () => {
    fixture.componentRef.setInput('label', 'Loading…');
    fixture.detectChanges();
    const root = fixture.debugElement.query(By.css('.ds-spinner'));
    expect(root.nativeElement.getAttribute('role')).toBe('status');
    expect(root.nativeElement.getAttribute('aria-hidden')).toBeNull();
  });

  it('should render the label text visually-hidden when provided', () => {
    fixture.componentRef.setInput('label', 'Loading…');
    fixture.detectChanges();
    const srText = fixture.debugElement.query(By.css('.ds-sr-only'));
    expect(srText).toBeTruthy();
    expect(srText.nativeElement.textContent.trim()).toBe('Loading…');
  });

  it('computed classes should reflect the size input', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(component.classes()).toContain('ds-spinner--lg');
  });
});
