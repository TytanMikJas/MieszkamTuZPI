import { Test, TestingModule } from '@nestjs/testing';
import { Attachment } from './attachment.service';

describe('Attachment', () => {
  let provider: Attachment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Attachment],
    }).compile();

    provider = module.get<Attachment>(Attachment);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
