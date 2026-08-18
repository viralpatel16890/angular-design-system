import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LiveRegionDirective } from './live-region.directive';

@Component({
  standalone: true,
  imports: [LiveRegionDirective],
  template: `
    <div class="polite-default" dsLiveRegion="polite"></div>
    <div class="assertive-default" dsLiveRegion="assertive"></div>
    <div
      class="polite-non-atomic-region"
      dsLiveRegion="polite"
      dsLiveRegionRole="region"
      [dsLiveRegionAtomic]="false"
    ></div>
    <div class="no-role" dsLiveRegion="polite" [dsLiveRegionRole]="null"></div>
  `,
})
class HostComponent {}

describe('LiveRegionDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('defaults a polite region to role="status", aria-live="polite", aria-atomic="true"', () => {
    const el = fixture.debugElement.query(By.css('.polite-default')).nativeElement;
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.getAttribute('aria-atomic')).toBe('true');
  });

  it('defaults an assertive region to role="alert", aria-live="assertive", aria-atomic="true"', () => {
    const el = fixture.debugElement.query(By.css('.assertive-default')).nativeElement;
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.getAttribute('aria-live')).toBe('assertive');
    expect(el.getAttribute('aria-atomic')).toBe('true');
  });

  it('allows overriding the role and atomicity (e.g. a landmark region that accumulates messages)', () => {
    const el = fixture.debugElement.query(By.css('.polite-non-atomic-region')).nativeElement;
    expect(el.getAttribute('role')).toBe('region');
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.getAttribute('aria-atomic')).toBe('false');
  });

  it('omits the role attribute entirely when dsLiveRegionRole is null', () => {
    const el = fixture.debugElement.query(By.css('.no-role')).nativeElement;
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.getAttribute('aria-live')).toBe('polite');
  });
});
