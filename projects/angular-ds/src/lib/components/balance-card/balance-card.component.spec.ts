import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BalanceCardComponent } from './balance-card.component';

describe('BalanceCardComponent', () => {
  let fixture: ComponentFixture<BalanceCardComponent>;
  let component: BalanceCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the formatted amount', () => {
    fixture.componentRef.setInput('amount', 1234.5);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-balance__value')).nativeElement.textContent).toContain('1,234.50');
  });
});
