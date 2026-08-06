import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MetricCardComponent } from './metric-card.component';

describe('MetricCardComponent', () => {
  let fixture: ComponentFixture<MetricCardComponent>;
  let component: MetricCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should abbreviate large values', () => {
    fixture.componentRef.setInput('value', 2_500_000);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-metric__value')).nativeElement.textContent).toContain('2.5M');
  });

  it('should render 10 spark bars', () => {
    expect(fixture.debugElement.queryAll(By.css('.ds-metric__bar')).length).toBe(10);
  });
});
