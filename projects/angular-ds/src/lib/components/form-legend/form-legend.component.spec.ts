import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormLegendComponent } from './form-legend.component';

describe('FormLegendComponent', () => {
  let fixture: ComponentFixture<FormLegendComponent>;
  let component: FormLegendComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLegendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the ds-form-legend element', () => {
    expect(fixture.debugElement.query(By.css('.ds-form-legend'))).toBeTruthy();
  });

  it('should render the default text', () => {
    const el: HTMLElement = fixture.debugElement.query(By.css('.ds-form-legend')).nativeElement;
    const normalized = el.textContent?.replace(/\s+/g, ' ').trim();
    expect(normalized).toBe('* Fields marked with * are required');
  });

  it('should render a hidden asterisk marker', () => {
    const marker = fixture.debugElement.query(By.css('.ds-form-legend__marker'));
    expect(marker).toBeTruthy();
    expect(marker.nativeElement.getAttribute('aria-hidden')).toBe('true');
    expect(marker.nativeElement.textContent).toBe('*');
  });

  it('should render custom text when the text input is overridden', () => {
    fixture.componentRef.setInput('text', 'Required fields are marked with an asterisk');
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.query(By.css('.ds-form-legend')).nativeElement;
    expect(el.textContent).toContain('Required fields are marked with an asterisk');
  });
});
