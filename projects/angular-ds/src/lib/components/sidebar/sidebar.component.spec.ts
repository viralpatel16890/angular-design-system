import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import type { SidebarGroup, SidebarItem } from './sidebar.types';

const PARENT_ITEM: SidebarItem = { id: 'nav', label: 'Navigation', children: [
  { id: 'child-1', label: 'Dashboard' },
  { id: 'child-2', label: 'Settings', disabled: true },
]};

const DISABLED_ITEM: SidebarItem = { id: 'disabled', label: 'Disabled', disabled: true };
const PLAIN_ITEM: SidebarItem = { id: 'plain', label: 'Plain' };
const ACTIVE_ITEM: SidebarItem = { id: 'active', label: 'Active', active: true };

const GROUPS: SidebarGroup[] = [
  { label: 'Main', items: [PLAIN_ITEM, ACTIVE_ITEM] },
  { items: [DISABLED_ITEM] },
];

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start with no expanded items', () => {
    expect(component.expandedIds().size).toBe(0);
  });

  // isActive()
  it('isActive() should return true when item.id matches activeId input', () => {
    fixture.componentRef.setInput('activeId', 'plain');
    fixture.detectChanges();
    expect(component.isActive(PLAIN_ITEM)).toBe(true);
  });

  it('isActive() should return true when item.active flag is true', () => {
    expect(component.isActive(ACTIVE_ITEM)).toBe(true);
  });

  it('isActive() should return false for a non-active item', () => {
    expect(component.isActive(PLAIN_ITEM)).toBe(false);
  });

  // isExpanded()
  it('isExpanded() should return false when item is not in expandedIds', () => {
    expect(component.isExpanded(PARENT_ITEM)).toBe(false);
  });

  it('isExpanded() should return true after toggleExpand()', () => {
    const event = new MouseEvent('click');
    component.toggleExpand(PARENT_ITEM, event);
    expect(component.isExpanded(PARENT_ITEM)).toBe(true);
  });

  it('isExpanded() should return false after toggling twice', () => {
    const event = new MouseEvent('click');
    component.toggleExpand(PARENT_ITEM, event);
    component.toggleExpand(PARENT_ITEM, event);
    expect(component.isExpanded(PARENT_ITEM)).toBe(false);
  });

  // hasActiveChild()
  it('hasActiveChild() should return true when a child is active by activeId', () => {
    const parent: SidebarItem = { id: 'parent', label: 'Parent', children: [
      { id: 'child-1', label: 'Child 1' },
    ]};
    fixture.componentRef.setInput('activeId', 'child-1');
    fixture.detectChanges();
    expect(component.hasActiveChild(parent)).toBe(true);
  });

  it('hasActiveChild() should return false when no children are active', () => {
    expect(component.hasActiveChild(PARENT_ITEM)).toBe(false);
  });

  it('hasActiveChild() should return false for an item with no children', () => {
    expect(component.hasActiveChild(PLAIN_ITEM)).toBe(false);
  });

  // toggleCollapse()
  it('should emit collapsedChange with negated value on toggleCollapse()', () => {
    const spy = vi.fn();
    component.collapsedChange.subscribe(spy);
    fixture.componentRef.setInput('collapsed', false);
    fixture.detectChanges();
    component.toggleCollapse();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit collapsedChange(false) when currently collapsed', () => {
    const spy = vi.fn();
    component.collapsedChange.subscribe(spy);
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();
    component.toggleCollapse();
    expect(spy).toHaveBeenCalledWith(false);
  });

  // onItemClick()
  it('should emit itemClick when clicking a non-disabled leaf item', () => {
    const spy = vi.fn();
    component.itemClick.subscribe(spy);
    component.onItemClick(PLAIN_ITEM);
    expect(spy).toHaveBeenCalledWith(PLAIN_ITEM);
  });

  it('should NOT emit itemClick when clicking a disabled item', () => {
    const spy = vi.fn();
    component.itemClick.subscribe(spy);
    component.onItemClick(DISABLED_ITEM);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit mobileClose when clicking a leaf item', () => {
    const spy = vi.fn();
    component.mobileClose.subscribe(spy);
    component.onItemClick(PLAIN_ITEM);
    expect(spy).toHaveBeenCalled();
  });

  it('should toggle expansion (not emit itemClick) when clicking an item with children', () => {
    const spy = vi.fn();
    component.itemClick.subscribe(spy);
    component.onItemClick(PARENT_ITEM);
    expect(spy).not.toHaveBeenCalled();
    expect(component.isExpanded(PARENT_ITEM)).toBe(true);
  });

  // onChildClick()
  it('should emit itemClick when clicking a non-disabled child item', () => {
    const spy = vi.fn();
    component.itemClick.subscribe(spy);
    component.onChildClick(PARENT_ITEM.children![0]);
    expect(spy).toHaveBeenCalledWith(PARENT_ITEM.children![0]);
  });

  it('should NOT emit itemClick when clicking a disabled child item', () => {
    const spy = vi.fn();
    component.itemClick.subscribe(spy);
    component.onChildClick(PARENT_ITEM.children![1]); // Settings is disabled
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit mobileClose when clicking a child item', () => {
    const spy = vi.fn();
    component.mobileClose.subscribe(spy);
    component.onChildClick(PARENT_ITEM.children![0]);
    expect(spy).toHaveBeenCalled();
  });

  // onBackdropClick()
  it('should emit mobileClose on backdrop click', () => {
    const spy = vi.fn();
    component.mobileClose.subscribe(spy);
    component.onBackdropClick();
    expect(spy).toHaveBeenCalled();
  });

  // Escape key handler
  it('should emit mobileClose on Escape when mobileOpen is true', () => {
    fixture.componentRef.setInput('mobileOpen', true);
    fixture.detectChanges();
    const spy = vi.fn();
    component.mobileClose.subscribe(spy);
    component.onEscape();
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT emit mobileClose on Escape when mobileOpen is false', () => {
    fixture.componentRef.setInput('mobileOpen', false);
    fixture.detectChanges();
    const spy = vi.fn();
    component.mobileClose.subscribe(spy);
    component.onEscape();
    expect(spy).not.toHaveBeenCalled();
  });
});
