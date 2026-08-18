import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let component: PaginationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function prevBtn(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('.ds-pagination__nav--prev')).nativeElement;
  }

  function nextBtn(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('.ds-pagination__nav--next')).nativeElement;
  }

  function pageButtons(): HTMLButtonElement[] {
    return fixture.debugElement
      .queryAll(By.css('.ds-pagination__item'))
      .map((el) => el.nativeElement as HTMLButtonElement);
  }

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a nav with aria-label="Pagination"', () => {
    const nav = fixture.debugElement.query(By.css('nav'));
    expect(nav).toBeTruthy();
    expect(nav.nativeElement.getAttribute('aria-label')).toBe('Pagination');
  });

  it('should give prev/next buttons proper aria-labels', () => {
    expect(prevBtn().getAttribute('aria-label')).toBe('Previous page');
    expect(nextBtn().getAttribute('aria-label')).toBe('Next page');
  });

  // ─── Boundary disabling ──────────────────────────────────────────────────────

  it('should disable the prev button on the first page', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    expect(prevBtn().disabled).toBe(true);
    expect(nextBtn().disabled).toBe(false);
  });

  it('should disable the next button on the last page', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    expect(nextBtn().disabled).toBe(true);
    expect(prevBtn().disabled).toBe(false);
  });

  it('should enable both prev and next on a middle page', () => {
    fixture.componentRef.setInput('currentPage', 3);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    expect(prevBtn().disabled).toBe(false);
    expect(nextBtn().disabled).toBe(false);
  });

  it('should disable both nav buttons when there is only one page', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 1);
    fixture.detectChanges();
    expect(prevBtn().disabled).toBe(true);
    expect(nextBtn().disabled).toBe(true);
  });

  // ─── pageChange emission ─────────────────────────────────────────────────────

  it('should emit pageChange with the previous page number when prev is clicked', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);
    fixture.componentRef.setInput('currentPage', 3);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    prevBtn().click();
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should emit pageChange with the next page number when next is clicked', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);
    fixture.componentRef.setInput('currentPage', 3);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    nextBtn().click();
    expect(spy).toHaveBeenCalledWith(4);
  });

  it('should emit pageChange with the clicked page number', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    const target = pageButtons().find((b) => b.textContent?.trim() === '4');
    target?.click();
    expect(spy).toHaveBeenCalledWith(4);
  });

  it('should not emit pageChange when clicking prev on the first page', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    prevBtn().click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit pageChange when clicking the already-active page', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    const target = pageButtons().find((b) => b.textContent?.trim() === '2');
    target?.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit pageChange when disabled', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    nextBtn().click();
    prevBtn().click();
    expect(spy).not.toHaveBeenCalled();
  });

  // ─── Ellipsis rendering ──────────────────────────────────────────────────────

  it('should render no ellipsis when totalPages fits within the slot budget', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.ds-pagination__ellipsis')).length).toBe(0);
    expect(pageButtons().length).toBe(5);
  });

  it('should render a single trailing ellipsis when near the start of a large range', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 20);
    fixture.detectChanges();
    const ellipses = fixture.debugElement.queryAll(By.css('.ds-pagination__ellipsis'));
    expect(ellipses.length).toBe(1);
    const labels = pageButtons().map((b) => b.textContent?.trim());
    expect(labels).toContain('20');
  });

  it('should render a single leading ellipsis when near the end of a large range', () => {
    fixture.componentRef.setInput('currentPage', 20);
    fixture.componentRef.setInput('totalPages', 20);
    fixture.detectChanges();
    const ellipses = fixture.debugElement.queryAll(By.css('.ds-pagination__ellipsis'));
    expect(ellipses.length).toBe(1);
    const labels = pageButtons().map((b) => b.textContent?.trim());
    expect(labels).toContain('1');
  });

  it('should render two ellipses when the current page is in the middle of a large range', () => {
    fixture.componentRef.setInput('currentPage', 10);
    fixture.componentRef.setInput('totalPages', 20);
    fixture.detectChanges();
    const ellipses = fixture.debugElement.queryAll(By.css('.ds-pagination__ellipsis'));
    expect(ellipses.length).toBe(2);
    const labels = pageButtons().map((b) => b.textContent?.trim());
    expect(labels).toEqual(['1', '9', '10', '11', '20']);
  });

  // ─── aria-current ────────────────────────────────────────────────────────────

  it('should mark the current page with aria-current="page"', () => {
    fixture.componentRef.setInput('currentPage', 3);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    const current = pageButtons().find((b) => b.textContent?.trim() === '3');
    expect(current?.getAttribute('aria-current')).toBe('page');
  });

  it('should not mark non-current pages with aria-current', () => {
    fixture.componentRef.setInput('currentPage', 3);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    const other = pageButtons().find((b) => b.textContent?.trim() === '2');
    expect(other?.getAttribute('aria-current')).toBeNull();
  });

  it('should apply the active class to the current page button', () => {
    fixture.componentRef.setInput('currentPage', 4);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.ds-pagination__item--active'));
    expect(el.nativeElement.textContent.trim()).toBe('4');
  });

  // ─── Misc ────────────────────────────────────────────────────────────────────

  it('should clamp currentPage within [1, totalPages]', () => {
    fixture.componentRef.setInput('currentPage', 99);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();
    expect(component.clampedPage()).toBe(5);
  });

  it('should apply the default size class (md)', () => {
    expect(fixture.debugElement.query(By.css('.ds-pagination--md'))).toBeTruthy();
  });

  it('should apply a custom size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-pagination--lg'))).toBeTruthy();
  });
});
