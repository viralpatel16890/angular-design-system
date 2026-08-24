import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let fixture: ComponentFixture<TooltipComponent>;
  let component: TooltipComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Helpful hint');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the bubble with role="tooltip"', () => {
    const bubble = fixture.debugElement.query(By.css('.ds-tooltip__bubble'));
    expect(bubble.nativeElement.getAttribute('role')).toBe('tooltip');
  });

  it('should give the bubble a stable, unique id', () => {
    const bubble = fixture.debugElement.query(By.css('.ds-tooltip__bubble')).nativeElement;
    expect(bubble.id).toBe(component.bubbleId);

    const fixture2 = TestBed.createComponent(TooltipComponent);
    expect(fixture2.componentInstance.bubbleId).not.toBe(component.bubbleId);
  });

  it('should link the host to the bubble via aria-describedby', () => {
    const host = fixture.debugElement.query(By.css('.ds-tooltip-host')).nativeElement;
    expect(host.getAttribute('aria-describedby')).toBe(component.bubbleId);
  });

  it('should not set aria-describedby when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const host = fixture.debugElement.query(By.css('.ds-tooltip-host')).nativeElement;
    expect(host.getAttribute('aria-describedby')).toBeNull();
  });
});
