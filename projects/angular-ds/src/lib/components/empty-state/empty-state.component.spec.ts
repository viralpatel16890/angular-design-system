import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let fixture: ComponentFixture<EmptyStateComponent>;
  let component: EmptyStateComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a status container', () => {
    expect(fixture.debugElement.query(By.css('.ds-empty-state[role="status"]'))).toBeTruthy();
  });

  it('should render the title when provided', () => {
    fixture.componentRef.setInput('title', 'No trades yet');
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.ds-empty-state__title'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent.trim()).toBe('No trades yet');
  });

  it('should NOT render a title element when title is empty', () => {
    expect(fixture.debugElement.query(By.css('.ds-empty-state__title'))).toBeNull();
  });

  it('should render the description when provided', () => {
    fixture.componentRef.setInput('description', 'Your recent trades will show up here.');
    fixture.detectChanges();
    const desc = fixture.debugElement.query(By.css('.ds-empty-state__description'));
    expect(desc).toBeTruthy();
    expect(desc.nativeElement.textContent.trim()).toBe('Your recent trades will show up here.');
  });

  it('should NOT render a description element when description is empty', () => {
    expect(fixture.debugElement.query(By.css('.ds-empty-state__description'))).toBeNull();
  });
});

@Component({
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <ds-empty-state title="No results" description="Try a different search.">
      <span icon>📭</span>
      <button action type="button">Try again</button>
    </ds-empty-state>
  `,
})
class EmptyStateHostComponent {}

describe('EmptyStateComponent (content projection)', () => {
  let fixture: ComponentFixture<EmptyStateHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateHostComponent);
    fixture.detectChanges();
  });

  it('should project content marked with [icon] into the icon slot', () => {
    const icon = fixture.debugElement.query(By.css('.ds-empty-state__icon span[icon]'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent.trim()).toBe('📭');
  });

  it('should project content marked with [action] into the action slot', () => {
    const action = fixture.debugElement.query(By.css('.ds-empty-state__action button[action]'));
    expect(action).toBeTruthy();
    expect(action.nativeElement.textContent.trim()).toBe('Try again');
  });
});
