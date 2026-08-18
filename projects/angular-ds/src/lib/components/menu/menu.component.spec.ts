import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MenuComponent } from './menu.component';
import { MenuItemComponent } from './menu-item.component';

@Component({
  standalone: true,
  imports: [MenuComponent, MenuItemComponent],
  template: `
    <ds-menu ariaLabel="Row actions">
      <ds-menu-item (selected)="onView()">View details</ds-menu-item>
      <ds-menu-item (selected)="onRepeat()">Repeat trade</ds-menu-item>
      <ds-menu-item variant="danger" [disabled]="true" (selected)="onDelete()">Delete</ds-menu-item>
    </ds-menu>
    <button id="outside">Outside</button>
  `,
})
class HostComponent {
  onView(): void {}
  onRepeat(): void {}
  onDelete(): void {}
}

describe('MenuComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  const getTrigger = (): HTMLButtonElement =>
    fixture.debugElement.query(By.css('.ds-menu__trigger')).nativeElement;

  const getPanel = (): HTMLUListElement | null =>
    fixture.debugElement.query(By.css('[role="menu"]'))?.nativeElement ?? null;

  const getMenuItems = (): HTMLButtonElement[] =>
    fixture.debugElement.queryAll(By.css('.ds-menu-item')).map(de => de.nativeElement);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    const menu = fixture.debugElement.query(By.directive(MenuComponent)).componentInstance;
    expect(menu).toBeTruthy();
  });

  it('should start closed with no panel rendered', () => {
    expect(getPanel()).toBeNull();
    expect(getTrigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('should mark the trigger with aria-haspopup="menu"', () => {
    expect(getTrigger().getAttribute('aria-haspopup')).toBe('menu');
  });

  it('should open the panel when the trigger is clicked', () => {
    getTrigger().click();
    fixture.detectChanges();
    expect(getPanel()).toBeTruthy();
    expect(getTrigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('should render role="menuitem" items inside the role="menu" panel', () => {
    getTrigger().click();
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('[role="menu"] [role="menuitem"]'));
    expect(items.length).toBe(3);
  });

  it('should close the panel when the trigger is clicked again (toggle)', () => {
    getTrigger().click();
    fixture.detectChanges();
    getTrigger().click();
    fixture.detectChanges();
    expect(getPanel()).toBeNull();
  });

  it('should close on Escape from the trigger', () => {
    getTrigger().click();
    fixture.detectChanges();
    getTrigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(getPanel()).toBeNull();
  });

  it('should close on Escape from within the panel and refocus the trigger', () => {
    getTrigger().click();
    fixture.detectChanges();
    const panel = getPanel()!;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(getPanel()).toBeNull();
    expect(document.activeElement).toBe(getTrigger());
  });

  it('should close when clicking outside the menu', () => {
    getTrigger().click();
    fixture.detectChanges();
    const outside = fixture.debugElement.query(By.css('#outside')).nativeElement as HTMLButtonElement;
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(getPanel()).toBeNull();
  });

  it('should NOT close when clicking inside the panel but not on an item', () => {
    getTrigger().click();
    fixture.detectChanges();
    const panel = getPanel()!;
    panel.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(getPanel()).toBeTruthy();
  });

  it('should emit selected and close the menu when an item is clicked', () => {
    const host = fixture.componentInstance;
    const spy = vi.spyOn(host, 'onView');
    getTrigger().click();
    fixture.detectChanges();
    getMenuItems()[0].click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(getPanel()).toBeNull();
  });

  it('should refocus the trigger after selecting an item', () => {
    getTrigger().click();
    fixture.detectChanges();
    getMenuItems()[0].click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(getTrigger());
  });

  it('should not emit selected when a disabled item is clicked', () => {
    const host = fixture.componentInstance;
    const spy = vi.spyOn(host, 'onDelete');
    getTrigger().click();
    fixture.detectChanges();
    getMenuItems()[2].click();
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should focus the first item when opened', async () => {
    getTrigger().click();
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(document.activeElement).toBe(getMenuItems()[0]);
  });

  it('should move focus to the next item on ArrowDown', async () => {
    getTrigger().click();
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));
    const panel = getPanel()!;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(getMenuItems()[1]);
  });

  it('should wrap from the last item to the first on ArrowDown', async () => {
    getTrigger().click();
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));
    const panel = getPanel()!;
    getMenuItems()[1].focus();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(getMenuItems()[0]);
  });

  it('should move focus to the previous item on ArrowUp', async () => {
    getTrigger().click();
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));
    const panel = getPanel()!;
    getMenuItems()[1].focus();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(getMenuItems()[0]);
  });

  it('should move focus to the first item on Home', async () => {
    getTrigger().click();
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));
    const panel = getPanel()!;
    getMenuItems()[1].focus();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(getMenuItems()[0]);
  });

  it('should move focus to the last enabled item on End', async () => {
    getTrigger().click();
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));
    const panel = getPanel()!;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    // The 3rd item is disabled, so getItems() excludes it — last enabled is index 1.
    expect(document.activeElement).toBe(getMenuItems()[1]);
  });

  it('should open on ArrowDown from the trigger when closed', () => {
    getTrigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(getPanel()).toBeTruthy();
  });
});

@Component({
  standalone: true,
  imports: [MenuComponent, MenuItemComponent],
  template: `
    <ds-menu ariaLabel="Row actions" [disabled]="true">
      <ds-menu-item>View details</ds-menu-item>
    </ds-menu>
  `,
})
class DisabledHostComponent {}

describe('MenuComponent (disabled)', () => {
  it('should not open when disabled', () => {
    TestBed.configureTestingModule({ imports: [DisabledHostComponent] });
    const fixture = TestBed.createComponent(DisabledHostComponent);
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.ds-menu__trigger')).nativeElement as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="menu"]'))).toBeNull();
  });
});

describe('MenuItemComponent', () => {
  let fixture: ComponentFixture<MenuItemComponent>;
  let component: MenuItemComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render role="menuitem"', () => {
    expect(fixture.debugElement.query(By.css('[role="menuitem"]'))).toBeTruthy();
  });

  it('should emit selected on click', () => {
    const spy = vi.fn();
    component.selected.subscribe(spy);
    fixture.debugElement.query(By.css('.ds-menu-item')).nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT emit selected when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.selected.subscribe(spy);
    component.onClick();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should apply danger variant class', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-menu-item--danger'))).toBeTruthy();
  });
});
