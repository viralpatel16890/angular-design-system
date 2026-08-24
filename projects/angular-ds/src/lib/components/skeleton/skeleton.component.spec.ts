import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let fixture: ComponentFixture<SkeletonComponent>;
  let component: SkeletonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to the text variant', () => {
    expect(fixture.debugElement.query(By.css('.ds-skeleton--text'))).toBeTruthy();
  });

  it('should render with role="status" and an accessible label', () => {
    const el = fixture.debugElement.query(By.css('[role="status"]'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.getAttribute('aria-label')).toBe('Loading…');
  });

  it('should apply the circle variant class', () => {
    fixture.componentRef.setInput('variant', 'circle');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-skeleton--circle'))).toBeTruthy();
  });

  it('should apply the rect variant class', () => {
    fixture.componentRef.setInput('variant', 'rect');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-skeleton--rect'))).toBeTruthy();
  });

  it('should apply custom width and height as inline styles', () => {
    fixture.componentRef.setInput('variant', 'rect');
    fixture.componentRef.setInput('width', '120px');
    fixture.componentRef.setInput('height', '40px');
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.ds-skeleton--rect')).nativeElement as HTMLElement;
    expect(el.style.width).toBe('120px');
    expect(el.style.height).toBe('40px');
  });

  it('should render a single element when lines is 1 (default)', () => {
    expect(fixture.debugElement.queryAll(By.css('.ds-skeleton')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('.ds-skeleton-group'))).toBeNull();
  });

  it('should render multiple lines for a multi-line text skeleton', () => {
    fixture.componentRef.setInput('lines', 3);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-skeleton-group'))).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.css('.ds-skeleton--text')).length).toBe(3);
  });

  it('should shorten the last line of a multi-line text skeleton by default', () => {
    fixture.componentRef.setInput('lines', 3);
    fixture.detectChanges();
    const lines = fixture.debugElement.queryAll(By.css('.ds-skeleton--text'));
    expect(lines[0].nativeElement.style.width).toBe('');
    expect(lines[2].nativeElement.style.width).toBe('70%');
  });

  it('should not treat non-text variants as multiline even if lines > 1', () => {
    fixture.componentRef.setInput('variant', 'rect');
    fixture.componentRef.setInput('lines', 3);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-skeleton-group'))).toBeNull();
    expect(fixture.debugElement.queryAll(By.css('.ds-skeleton')).length).toBe(1);
  });
});
