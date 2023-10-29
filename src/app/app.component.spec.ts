import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { AuthService } from './shared/Auth/auth.service';

describe('AppComponent', () => {

  let mockAuthService;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(["AutoLogin"]);
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  //it(`should have as title 'SRV_Client'`, () => {
  //  const fixture = TestBed.createComponent(AppComponent);
  //  const app = fixture.componentInstance;
  //  expect(app.title).toEqual('SRV_Client');
  //});

  //it('should render title', () => {
  //  const fixture = TestBed.createComponent(AppComponent);
  //  fixture.detectChanges();
  //  const compiled = fixture.nativeElement as HTMLElement;
  //  expect(compiled.querySelector('.content span')?.textContent).toContain('SRV_Client app is running!');
  //});

  it('OnInit should call AutoLogin from AuthService', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    
    fixture.detectChanges();
    expect(mockAuthService.AutoLogin).toHaveBeenCalled();
  });
});
