import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TransactionItemComponent } from './transaction-item.component';

describe('TransactionItemComponent', () => {
  let fixture: ComponentFixture<TransactionItemComponent>;
  let component: TransactionItemComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should map a failed status to the danger badge variant', () => {
    fixture.componentRef.setInput('status', 'failed');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-badge')).componentInstance.variant()).toBe('danger');
  });

  it('should emit itemClicked when activated and clickable', () => {
    const spy = vi.fn();
    component.itemClicked.subscribe(spy);
    fixture.debugElement.query(By.css('.ds-txn')).nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });
});
