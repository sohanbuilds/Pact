import { CurrentUser } from './current-user.decorator';

describe('CurrentUserDecorator', () => {
  it('should be defined', () => {
    expect(CurrentUser()).toBeDefined();
  });
});
