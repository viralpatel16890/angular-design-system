import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CryptoTickerComponent } from './crypto-ticker.component';

describe('CryptoTickerComponent', () => {
  let fixture: ComponentFixture<CryptoTickerComponent>;
  let component: CryptoTickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoTickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CryptoTickerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => fixture.destroy());

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the formatted price', () => {
    fixture.componentRef.setInput('price', 65000);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-ticker__price')).nativeElement.textContent).toContain('65,000.00');
  });

  it('should mark the price/change region as an aria-live polite region', () => {
    fixture.detectChanges();
    const region = fixture.debugElement.query(By.css('.ds-ticker__right')).nativeElement;
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
    expect(region.getAttribute('role')).toBe('status');
  });
});
