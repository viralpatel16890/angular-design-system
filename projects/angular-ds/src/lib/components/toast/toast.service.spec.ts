import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty toast list', () => {
    expect(service.toasts().length).toBe(0);
  });

  it('should add a toast via show()', () => {
    service.show('Hello!', { variant: 'info' });
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Hello!');
  });

  it('should return the toast id from show()', () => {
    const id = service.show('Test');
    expect(typeof id).toBe('string');
    expect(id.startsWith('toast-')).toBe(true);
  });

  it('should set default variant to info when not provided', () => {
    service.show('Default');
    expect(service.toasts()[0].variant).toBe('info');
  });

  it('should set default duration to 4000 when not provided', () => {
    service.show('Duration default');
    expect(service.toasts()[0].duration).toBe(4000);
  });

  it('should set dismissible to true by default', () => {
    service.show('Dismissible default');
    expect(service.toasts()[0].dismissible).toBe(true);
  });

  it('should add a success toast via .success()', () => {
    service.success('Done');
    expect(service.toasts()[0].variant).toBe('success');
    expect(service.toasts()[0].message).toBe('Done');
  });

  it('should add an info toast via .info()', () => {
    service.info('Info message');
    expect(service.toasts()[0].variant).toBe('info');
  });

  it('should add a warning toast via .warning()', () => {
    service.warning('Warning!');
    expect(service.toasts()[0].variant).toBe('warning');
  });

  it('should add an error toast via .error()', () => {
    service.error('Something went wrong');
    expect(service.toasts()[0].variant).toBe('error');
  });

  it('should store optional title when provided', () => {
    service.show('With title', { title: 'Heads up' });
    expect(service.toasts()[0].title).toBe('Heads up');
  });

  it('should add multiple toasts', () => {
    service.show('A');
    service.show('B');
    service.show('C');
    expect(service.toasts().length).toBe(3);
  });

  it('should mark a toast as removing when dismiss() is called', () => {
    const id = service.show('Dismiss me');
    service.dismiss(id);
    const toast = service.toasts().find(t => t.id === id);
    expect(toast?.removing).toBe(true);
  });

  it('should remove the toast from list after dismiss animation (250ms)', () => {
    const id = service.show('Dismiss me');
    service.dismiss(id);
    vi.advanceTimersByTime(300);
    expect(service.toasts().find(t => t.id === id)).toBeUndefined();
  });

  it('should auto-dismiss after the specified duration', () => {
    service.show('Auto dismiss', { duration: 1000 });
    expect(service.toasts().length).toBe(1);
    // Advance past duration (1000ms) then past dismiss animation (250ms)
    vi.advanceTimersByTime(1300);
    expect(service.toasts().length).toBe(0);
  });

  it('should NOT auto-dismiss when duration is 0', () => {
    service.show('Persistent', { duration: 0 });
    vi.advanceTimersByTime(10000);
    expect(service.toasts().length).toBe(1);
  });

  it('should clear all toasts via clear()', () => {
    service.show('A');
    service.show('B');
    service.show('C');
    service.clear();
    expect(service.toasts().length).toBe(0);
  });

  it('should expose toasts as a readonly signal', () => {
    // The public property should not have a .set method
    expect(typeof (service.toasts as unknown as { set?: unknown }).set).toBe('undefined');
  });
});
