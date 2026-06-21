import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;
  let component: BadgeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a span with role="status"', () => {
    const span = fixture.debugElement.query(By.css('span[role="status"]'));
    expect(span).toBeTruthy();
  });

  it('should apply the ds-badge base class', () => {
    expect(fixture.debugElement.query(By.css('.ds-badge'))).toBeTruthy();
  });

  it('should render with default variant class (default)', () => {
    expect(fixture.debugElement.query(By.css('.ds-badge--default'))).toBeTruthy();
  });

  it('should render with default size class (md)', () => {
    expect(fixture.debugElement.query(By.css('.ds-badge--md'))).toBeTruthy();
  });

  it('should render with default shape class (rounded)', () => {
    expect(fixture.debugElement.query(By.css('.ds-badge--rounded'))).toBeTruthy();
  });

  it('should apply primary variant class', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-badge--primary'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.ds-badge--default'))).toBeNull();
  });

  it('should apply lg size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-badge--lg'))).toBeTruthy();
  });

  it('should apply sm size class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-badge--sm'))).toBeTruthy();
  });

  it('should apply pill shape class', () => {
    fixture.componentRef.setInput('shape', 'pill');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-badge--pill'))).toBeTruthy();
  });

  it('should add dot class when dot input is true', () => {
    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-badge--dot'))).toBeTruthy();
  });

  it('should render the dot indicator span when dot is true', () => {
    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-badge__dot'))).toBeTruthy();
  });

  it('should NOT render the dot indicator span when dot is false', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-badge__dot'))).toBeNull();
  });

  it('should not include dot class when dot is false', () => {
    expect(component.classes()).not.toContain('ds-badge--dot');
  });

  it('computed classes should reflect all inputs together', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.componentRef.setInput('size', 'sm');
    fixture.componentRef.setInput('shape', 'pill');
    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();
    const cls = component.classes();
    expect(cls).toContain('ds-badge--success');
    expect(cls).toContain('ds-badge--sm');
    expect(cls).toContain('ds-badge--pill');
    expect(cls).toContain('ds-badge--dot');
  });
});
