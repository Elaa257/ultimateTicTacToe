import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueModalComponent } from './queue-modal.component';

describe('QueueModalComponent', () => {
  let component: QueueModalComponent;
  let fixture: ComponentFixture<QueueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
