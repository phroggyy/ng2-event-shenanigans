import { MaroAppPage } from './app.po';

describe('maro-app App', function() {
  let page: MaroAppPage;

  beforeEach(() => {
    page = new MaroAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
