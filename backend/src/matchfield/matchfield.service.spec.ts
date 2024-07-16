import { Test, TestingModule } from '@nestjs/testing';
import { MatchfieldService } from './matchfield.service';

describe('MatchfieldService', () => {
  let provider: MatchfieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchfieldService],
    }).compile();

    provider = module.get<MatchfieldService>(MatchfieldService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
