import { CrimsonModule } from './crimson.module';

describe('CrimsonModule', () => {
  let crimsonModule: CrimsonModule;

  beforeEach(() => {
    crimsonModule = new CrimsonModule();
  });

  it('should create an instance', () => {
    expect(crimsonModule).toBeTruthy();
  });
});
