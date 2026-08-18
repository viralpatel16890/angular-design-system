import { TestBed } from '@angular/core/testing';
import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no pending request', () => {
    expect(service.request()).toBeNull();
  });

  it('should populate the request signal when confirm() is called', () => {
    void service.confirm({ title: 'Delete item?', message: 'This cannot be undone.' });
    const req = service.request();
    expect(req).not.toBeNull();
    expect(req?.title).toBe('Delete item?');
    expect(req?.message).toBe('This cannot be undone.');
  });

  it('should default confirmLabel to "Confirm" and cancelLabel to "Cancel"', () => {
    void service.confirm({ title: 'Title', message: 'Message' });
    const req = service.request();
    expect(req?.confirmLabel).toBe('Confirm');
    expect(req?.cancelLabel).toBe('Cancel');
  });

  it('should default variant to "default"', () => {
    void service.confirm({ title: 'Title', message: 'Message' });
    expect(service.request()?.variant).toBe('default');
  });

  it('should honor custom labels and the danger variant', () => {
    void service.confirm({
      title: 'Discard trade?',
      message: 'Unsaved details will be lost.',
      confirmLabel: 'Discard',
      cancelLabel: 'Keep editing',
      variant: 'danger',
    });
    const req = service.request();
    expect(req?.confirmLabel).toBe('Discard');
    expect(req?.cancelLabel).toBe('Keep editing');
    expect(req?.variant).toBe('danger');
  });

  it('should assign each request a unique id', () => {
    void service.confirm({ title: 'A', message: 'A' });
    const first = service.request()?.id;
    service.resolve(false);
    void service.confirm({ title: 'B', message: 'B' });
    const second = service.request()?.id;
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(first).not.toBe(second);
  });

  it('should resolve the promise with true and clear the request on resolve(true)', async () => {
    const promise = service.confirm({ title: 'Title', message: 'Message' });
    expect(service.request()).not.toBeNull();

    service.resolve(true);

    await expect(promise).resolves.toBe(true);
    expect(service.request()).toBeNull();
  });

  it('should resolve the promise with false on resolve(false)', async () => {
    const promise = service.confirm({ title: 'Title', message: 'Message' });
    service.resolve(false);
    await expect(promise).resolves.toBe(false);
  });

  it('should resolve a previous pending confirmation with false when a new one is requested', async () => {
    const first = service.confirm({ title: 'First', message: 'First message' });
    const second = service.confirm({ title: 'Second', message: 'Second message' });

    await expect(first).resolves.toBe(false);

    // The second request is still pending and now reflected in state.
    expect(service.request()?.title).toBe('Second');

    service.resolve(true);
    await expect(second).resolves.toBe(true);
  });

  it('should expose request as a readonly signal', () => {
    expect(typeof (service.request as unknown as { set?: unknown }).set).toBe('undefined');
  });
});
