import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysAdminSiteContentComponent } from './sys-admin-site-content.component';

describe('SysAdminSiteCategoryComponent', () => {
  let component: SysAdminSiteContentComponent;
  let fixture: ComponentFixture<SysAdminSiteContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SysAdminSiteContentComponent]
    });
    fixture = TestBed.createComponent(SysAdminSiteContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
