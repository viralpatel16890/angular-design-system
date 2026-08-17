import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkipLinkComponent } from './skip-link.component';

describe('SkipLinkComponent', () => {
  let fixture: ComponentFixture<SkipLinkComponent>;
  let component: SkipLinkComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkipLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkipLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render an anchor with the ds-skip-link class', () => {
    const link = fixture.debugElement.query(By.css('a.ds-skip-link'));
    expect(link).toBeTruthy();
  });

  it('should default the href to #main-content', () => {
    const link = fixture.debugElement.query(By.css('a.ds-skip-link'));
    expect(link.nativeElement.getAttribute('href')).toBe('#main-content');
  });

  it('should default the label to "Skip to main content"', () => {
    const link = fixture.debugElement.query(By.css('a.ds-skip-link'));
    expect(link.nativeElement.textContent.trim()).toBe('Skip to main content');
  });

  it('should point the href at a custom targetId', () => {
    fixture.componentRef.setInput('targetId', 'primary');
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('a.ds-skip-link'));
    expect(link.nativeElement.getAttribute('href')).toBe('#primary');
  });

  it('should render a custom label', () => {
    fixture.componentRef.setInput('label', 'Skip navigation');
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('a.ds-skip-link'));
    expect(link.nativeElement.textContent.trim()).toBe('Skip navigation');
  });
});
