import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogService } from './confirm-dialog.service';

// jsdom does not implement HTMLDialogElement.showModal/close natively in all versions,
// so we patch it on the prototype before each test (same approach as modal.component.spec.ts).
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

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;
  let service: ConfirmDialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ConfirmDialogService);
    fixture.detectChanges();

    const dialogEl = fixture.debugElement.query(By.css('dialog'))?.nativeElement;
    if (dialogEl) patchDialogElement(dialogEl);
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not be open when there is no pending confirmation', () => {
    expect(component.isOpen()).toBe(false);
  });

  it('should open and render the title/message when confirm() is called', () => {
    void service.confirm({ title: 'Discard trade?', message: 'Unsaved details will be lost.' });
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);
    const titleEl = fixture.debugElement.query(By.css('.ds-modal__title'));
    expect(titleEl.nativeElement.textContent.trim()).toBe('Discard trade?');
    const messageEl = fixture.debugElement.query(By.css('.ds-confirm-dialog__message'));
    expect(messageEl.nativeElement.textContent.trim()).toBe('Unsaved details will be lost.');
  });

  it('should use the primary button variant by default', () => {
    void service.confirm({ title: 'Save changes?', message: 'Apply your edits.' });
    fixture.detectChanges();
    expect(component.confirmButtonVariant()).toBe('primary');
  });

  it('should use the danger button variant when variant is "danger"', () => {
    void service.confirm({ title: 'Delete account?', message: 'This cannot be undone.', variant: 'danger' });
    fixture.detectChanges();
    expect(component.confirmButtonVariant()).toBe('danger');
    const confirmBtn = fixture.debugElement.queryAll(By.css('.ds-confirm-dialog__footer .ds-btn'))[1];
    expect(confirmBtn.nativeElement.classList).toContain('ds-btn--danger');
  });

  it('should resolve true and close when the confirm button is clicked', async () => {
    const promise = service.confirm({ title: 'Delete item?', message: 'Permanently remove it.' });
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.ds-confirm-dialog__footer .ds-btn'));
    buttons[1].nativeElement.click();
    fixture.detectChanges();

    await expect(promise).resolves.toBe(true);
    expect(component.isOpen()).toBe(false);
  });

  it('should resolve false and close when the cancel button is clicked', async () => {
    const promise = service.confirm({ title: 'Delete item?', message: 'Permanently remove it.' });
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.ds-confirm-dialog__footer .ds-btn'));
    buttons[0].nativeElement.click();
    fixture.detectChanges();

    await expect(promise).resolves.toBe(false);
    expect(component.isOpen()).toBe(false);
  });

  it('should resolve false when the modal is closed via Escape/backdrop/close button', async () => {
    const promise = service.confirm({ title: 'Delete item?', message: 'Permanently remove it.' });
    fixture.detectChanges();

    component.onModalClosed();
    fixture.detectChanges();

    await expect(promise).resolves.toBe(false);
    expect(component.isOpen()).toBe(false);
  });

  it('should default confirm/cancel labels when not provided', () => {
    void service.confirm({ title: 'Title', message: 'Message' });
    fixture.detectChanges();
    expect(component.confirmLabel()).toBe('Confirm');
    expect(component.cancelLabel()).toBe('Cancel');
  });

  it('should render custom confirm/cancel labels', () => {
    void service.confirm({
      title: 'Cancel trade?',
      message: 'This will unwind the open position.',
      confirmLabel: 'Cancel trade',
      cancelLabel: 'Keep position',
    });
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.ds-confirm-dialog__footer .ds-btn'));
    expect(buttons[0].nativeElement.textContent.trim()).toBe('Keep position');
    expect(buttons[1].nativeElement.textContent.trim()).toBe('Cancel trade');
  });
});
