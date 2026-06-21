import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';

// jsdom does not implement HTMLDialogElement.showModal/close natively in all versions,
// so we patch it on the prototype before each test.
function patchDialogElement(dialogEl: HTMLDialogElement): void {
  if (typeof dialogEl.showModal !== 'function') {
    dialogEl.showModal = function () {
      (this as HTMLDialogElement & { open: boolean }).open = true;
    };
  }
  if (typeof dialogEl.close !== 'function') {
    dialogEl.close = function () {
      (this as HTMLDialogElement & { open: boolean }).open = false;
    };
  }
}

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let component: ModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Patch the dialog element after the view has been created
    const dialogEl = fixture.debugElement.query(By.css('dialog'))?.nativeElement;
    if (dialogEl) patchDialogElement(dialogEl);
  });

  afterEach(() => {
    // Clean up any overflow side-effect
    document.body.style.overflow = '';
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a dialog element', () => {
    expect(fixture.debugElement.query(By.css('dialog'))).toBeTruthy();
  });

  it('should apply the default modal class with size (md)', () => {
    expect(fixture.debugElement.query(By.css('dialog.ds-modal--md'))).toBeTruthy();
  });

  it('should apply the ds-modal base class', () => {
    expect(fixture.debugElement.query(By.css('.ds-modal'))).toBeTruthy();
  });

  it('should apply a different size class when size input changes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-modal--lg'))).toBeTruthy();
  });

  it('should render the modal panel div', () => {
    expect(fixture.debugElement.query(By.css('.ds-modal__panel'))).toBeTruthy();
  });

  it('should render the close button by default', () => {
    expect(fixture.debugElement.query(By.css('.ds-modal__close'))).toBeTruthy();
  });

  it('should NOT render the close button when hideClose is true', () => {
    fixture.componentRef.setInput('hideClose', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-modal__close'))).toBeNull();
  });

  it('should render the title when title input is provided', () => {
    fixture.componentRef.setInput('title', 'Confirm action');
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.ds-modal__title'));
    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.textContent.trim()).toBe('Confirm action');
  });

  it('should set aria-labelledby when title is provided', () => {
    fixture.componentRef.setInput('title', 'My Modal');
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(By.css('dialog'));
    expect(dialog.nativeElement.getAttribute('aria-labelledby')).toBe('ds-modal-title');
  });

  it('should NOT set aria-labelledby when no title', () => {
    const dialog = fixture.debugElement.query(By.css('dialog'));
    expect(dialog.nativeElement.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should emit closed when close() is called', () => {
    const spy = vi.fn();
    component.closed.subscribe(spy);
    component.close();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should emit closed when close button is clicked', () => {
    const spy = vi.fn();
    component.closed.subscribe(spy);
    fixture.debugElement.query(By.css('.ds-modal__close')).nativeElement.click();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('computed dialogClasses should include base and size', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(component.dialogClasses()).toBe('ds-modal ds-modal--sm');
  });

  it('should NOT emit closed from Escape when closeOnEscape is false', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('closeOnEscape', false);
    fixture.detectChanges();
    const spy = vi.fn();
    component.closed.subscribe(spy);
    component.onEscape();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should NOT emit closed from Escape when modal is not open', () => {
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    const spy = vi.fn();
    component.closed.subscribe(spy);
    component.onEscape();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit closed from Escape when open and closeOnEscape is true', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('closeOnEscape', true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.closed.subscribe(spy);
    component.onEscape();
    expect(spy).toHaveBeenCalledOnce();
  });
});
