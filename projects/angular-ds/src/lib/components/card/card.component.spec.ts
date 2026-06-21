import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardComponent } from './card.component';
import { CardBodyComponent } from './card-body.component';
import { CardHeaderComponent } from './card-header.component';
import { CardFooterComponent } from './card-footer.component';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;
  let component: CardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render an article element', () => {
    expect(fixture.debugElement.query(By.css('article'))).toBeTruthy();
  });

  it('should apply ds-card base class', () => {
    expect(fixture.debugElement.query(By.css('.ds-card'))).toBeTruthy();
  });

  it('should apply the default variant class (elevated)', () => {
    expect(fixture.debugElement.query(By.css('.ds-card--elevated'))).toBeTruthy();
  });

  it('should apply the default padding class (md)', () => {
    expect(fixture.debugElement.query(By.css('.ds-card--p-md'))).toBeTruthy();
  });

  it('should apply a different variant class when variant input changes', () => {
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-card--outlined'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.ds-card--elevated'))).toBeNull();
  });

  it('should apply flat variant class', () => {
    fixture.componentRef.setInput('variant', 'flat');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-card--flat'))).toBeTruthy();
  });

  it('should apply different padding class when padding input changes', () => {
    fixture.componentRef.setInput('padding', 'lg');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-card--p-lg'))).toBeTruthy();
  });

  it('should apply interactive class when interactive is true', () => {
    fixture.componentRef.setInput('interactive', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-card--interactive'))).toBeTruthy();
  });

  it('should NOT apply interactive class by default', () => {
    expect(fixture.debugElement.query(By.css('.ds-card--interactive'))).toBeNull();
  });

  it('should set tabindex="0" on the article when interactive is true', () => {
    fixture.componentRef.setInput('interactive', true);
    fixture.detectChanges();
    const article = fixture.debugElement.query(By.css('article'));
    expect(article.nativeElement.getAttribute('tabindex')).toBe('0');
  });

  it('should NOT set tabindex when not interactive', () => {
    const article = fixture.debugElement.query(By.css('article'));
    expect(article.nativeElement.getAttribute('tabindex')).toBeNull();
  });

  it('should apply full-height class when fullHeight is true', () => {
    fixture.componentRef.setInput('fullHeight', true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ds-card--full-height'))).toBeTruthy();
  });

  it('should NOT apply full-height class by default', () => {
    expect(fixture.debugElement.query(By.css('.ds-card--full-height'))).toBeNull();
  });

  it('computed classes should contain all active classes', () => {
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.componentRef.setInput('padding', 'sm');
    fixture.componentRef.setInput('interactive', true);
    fixture.componentRef.setInput('fullHeight', true);
    fixture.detectChanges();
    const cls = component.classes();
    expect(cls).toContain('ds-card');
    expect(cls).toContain('ds-card--outlined');
    expect(cls).toContain('ds-card--p-sm');
    expect(cls).toContain('ds-card--interactive');
    expect(cls).toContain('ds-card--full-height');
  });
});

describe('CardBodyComponent', () => {
  let fixture: ComponentFixture<CardBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBodyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardBodyComponent);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a div with class ds-card-body', () => {
    expect(fixture.debugElement.query(By.css('.ds-card-body'))).toBeTruthy();
  });
});

describe('CardHeaderComponent', () => {
  let fixture: ComponentFixture<CardHeaderComponent>;
  let component: CardHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a header element with class ds-card-header', () => {
    expect(fixture.debugElement.query(By.css('header.ds-card-header'))).toBeTruthy();
  });

  it('should render subtitle when subtitle input is provided', () => {
    fixture.componentRef.setInput('subtitle', 'Card subtitle');
    fixture.detectChanges();
    const subtitle = fixture.debugElement.query(By.css('.ds-card-header__subtitle'));
    expect(subtitle).toBeTruthy();
    expect(subtitle.nativeElement.textContent.trim()).toBe('Card subtitle');
  });

  it('should NOT render subtitle element when subtitle is empty', () => {
    expect(fixture.debugElement.query(By.css('.ds-card-header__subtitle'))).toBeNull();
  });
});

describe('CardFooterComponent', () => {
  let fixture: ComponentFixture<CardFooterComponent>;
  let component: CardFooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a footer element with default justify class (end)', () => {
    expect(fixture.debugElement.query(By.css('footer.ds-card-footer--end'))).toBeTruthy();
  });

  it('should apply start justify class', () => {
    fixture.componentRef.setInput('justify', 'start');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('footer.ds-card-footer--start'))).toBeTruthy();
  });

  it('should apply between justify class', () => {
    fixture.componentRef.setInput('justify', 'between');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('footer.ds-card-footer--between'))).toBeTruthy();
  });

  it('should apply center justify class', () => {
    fixture.componentRef.setInput('justify', 'center');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('footer.ds-card-footer--center'))).toBeTruthy();
  });
});
