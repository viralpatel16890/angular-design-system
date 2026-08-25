import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  let fixture: ComponentFixture<StatCardComponent>;
  let component: StatCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('decimal formatting (former balance-card use case)', () => {
    it('renders a thousands-separated, 2-decimal value with a currency prefix', () => {
      fixture.componentRef.setInput('value', 1234.5);
      fixture.componentRef.setInput('prefix', '$');
      fixture.detectChanges();

      const value = fixture.debugElement.query(By.css('.ds-stat__number')).nativeElement.textContent;
      expect(value).toContain('1,234.50');
      const affix = fixture.debugElement.query(By.css('.ds-stat__affix')).nativeElement.textContent;
      expect(affix).toContain('$');
    });

    it('honors a custom decimals count', () => {
      fixture.componentRef.setInput('value', 1234.5);
      fixture.componentRef.setInput('decimals', 0);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.ds-stat__number')).nativeElement.textContent,
      ).toContain('1,235');
    });
  });

  describe('compact formatting (former metric-card use case)', () => {
    it('abbreviates large values with K/M suffixes', () => {
      fixture.componentRef.setInput('value', 2_500_000);
      fixture.componentRef.setInput('compact', true);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.ds-stat__number')).nativeElement.textContent,
      ).toContain('2.5M');
    });

    it('renders small values as plain integers', () => {
      fixture.componentRef.setInput('value', 842);
      fixture.componentRef.setInput('compact', true);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.ds-stat__number')).nativeElement.textContent.trim(),
      ).toBe('842');
    });
  });

  describe('trend indicator', () => {
    it('is hidden when trend is not provided', () => {
      expect(fixture.debugElement.query(By.css('.ds-stat__trend'))).toBeNull();
    });

    it('renders an upward indicator for a non-negative trend, including zero', () => {
      fixture.componentRef.setInput('trend', 0);
      fixture.detectChanges();

      const trend = fixture.debugElement.query(By.css('.ds-stat__trend'));
      expect(trend).not.toBeNull();
      expect(trend.nativeElement.classList).toContain('ds-stat__trend--up');
      expect(trend.nativeElement.textContent).toContain('0.0%');
    });

    it('renders a downward indicator for a negative trend', () => {
      fixture.componentRef.setInput('trend', -3.4);
      fixture.detectChanges();

      const trend = fixture.debugElement.query(By.css('.ds-stat__trend'));
      expect(trend.nativeElement.classList).toContain('ds-stat__trend--down');
      expect(trend.nativeElement.textContent).toContain('3.4%');
    });
  });

  it('applies the accent class', () => {
    fixture.componentRef.setInput('accent', 'violet');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.ds-stat')).nativeElement.classList).toContain(
      'ds-stat--violet',
    );
  });

  it('renders the caption only when provided', () => {
    expect(fixture.debugElement.query(By.css('.ds-stat__caption'))).toBeNull();

    fixture.componentRef.setInput('caption', 'vs last month');
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.ds-stat__caption')).nativeElement.textContent,
    ).toContain('vs last month');
  });
});
