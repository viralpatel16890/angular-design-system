import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from './navbar.component';
import type { NavItem } from './navbar.types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',    href: '/',        active: true },
  { label: 'About',   href: '/about' },
  { label: 'Contact', href: '/contact', disabled: true },
];

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a header with role="banner"', () => {
    expect(fixture.debugElement.query(By.css('header[role="banner"]'))).toBeTruthy();
  });

  it('should apply sticky class by default', () => {
    expect(fixture.debugElement.query(By.css('.ds-navbar--sticky'))).toBeTruthy();
  });

  it('should NOT apply sticky class when sticky is false', () => {
    fixture.componentRef.setInput('sticky', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-navbar--sticky'))).toBeNull();
  });

  it('should apply bordered class by default', () => {
    expect(fixture.debugElement.query(By.css('.ds-navbar--bordered'))).toBeTruthy();
  });

  it('should NOT apply bordered class when bordered is false', () => {
    fixture.componentRef.setInput('bordered', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-navbar--bordered'))).toBeNull();
  });

  it('should render nav links for each item in items input', () => {
    fixture.componentRef.setInput('items', NAV_ITEMS);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.ds-navbar__link'));
    expect(links.length).toBe(3);
  });

  it('should mark active item with active class and aria-current', () => {
    fixture.componentRef.setInput('items', NAV_ITEMS);
    fixture.detectChanges();
    const activeLink = fixture.debugElement.query(By.css('.ds-navbar__link--active'));
    expect(activeLink).toBeTruthy();
    expect(activeLink.nativeElement.getAttribute('aria-current')).toBe('page');
  });

  it('should mark disabled item with disabled class and aria-disabled', () => {
    fixture.componentRef.setInput('items', NAV_ITEMS);
    fixture.detectChanges();
    const disabledLink = fixture.debugElement.query(By.css('.ds-navbar__link--disabled'));
    expect(disabledLink).toBeTruthy();
    expect(disabledLink.nativeElement.getAttribute('aria-disabled')).toBe('true');
  });

  it('should start with mobile menu closed', () => {
    expect(component.mobileOpen()).toBe(false);
  });

  it('should open mobile menu on toggleMobile()', () => {
    component.toggleMobile();
    expect(component.mobileOpen()).toBe(true);
  });

  it('should close mobile menu on closeMobile()', () => {
    component.toggleMobile();
    component.closeMobile();
    expect(component.mobileOpen()).toBe(false);
  });

  it('should emit menuToggled(true) when mobile menu opens', () => {
    const spy = vi.fn();
    component.menuToggled.subscribe(spy);
    component.toggleMobile();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit menuToggled(false) when mobile menu closes', () => {
    const spy = vi.fn();
    component.toggleMobile(); // open first
    component.menuToggled.subscribe(spy);
    component.closeMobile();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should render mobile nav when mobileOpen is true', () => {
    component.toggleMobile();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-navbar__mobile'))).toBeTruthy();
  });

  it('should NOT render mobile nav when mobileOpen is false', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-navbar__mobile'))).toBeNull();
  });

  it('should emit itemClick when a non-disabled item is clicked', () => {
    fixture.componentRef.setInput('items', NAV_ITEMS);
    fixture.detectChanges();
    const spy = vi.fn();
    component.itemClick.subscribe(spy);
    component.onItemClick(NAV_ITEMS[1]); // About
    expect(spy).toHaveBeenCalledWith(NAV_ITEMS[1]);
  });

  it('should NOT emit itemClick when a disabled item is clicked', () => {
    fixture.componentRef.setInput('items', NAV_ITEMS);
    fixture.detectChanges();
    const spy = vi.fn();
    component.itemClick.subscribe(spy);
    component.onItemClick(NAV_ITEMS[2]); // Contact (disabled)
    expect(spy).not.toHaveBeenCalled();
  });

  it('should close mobile menu when item is clicked', () => {
    component.toggleMobile();
    component.onItemClick(NAV_ITEMS[1]);
    expect(component.mobileOpen()).toBe(false);
  });

  it('should close mobile menu on Escape key when open', () => {
    component.toggleMobile();
    component.onEscape();
    expect(component.mobileOpen()).toBe(false);
  });

  it('should NOT close mobile menu on Escape key when already closed', () => {
    const spy = vi.fn();
    component.menuToggled.subscribe(spy);
    component.onEscape(); // menu is already closed
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render hamburger button', () => {
    expect(fixture.debugElement.query(By.css('.ds-navbar__burger'))).toBeTruthy();
  });

  it('should set aria-expanded on burger when mobile menu is open', () => {
    component.toggleMobile();
    fixture.detectChanges();
    const burger = fixture.debugElement.query(By.css('.ds-navbar__burger'));
    expect(burger.nativeElement.getAttribute('aria-expanded')).toBe('true');
  });
});
