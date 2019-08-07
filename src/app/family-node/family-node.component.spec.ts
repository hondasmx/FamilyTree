import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyNodeComponent } from './family-node.component';

describe('FamilyNodeComponent', () => {
  let component: FamilyNodeComponent;
  let fixture: ComponentFixture<FamilyNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
