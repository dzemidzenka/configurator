import { ConfiguratorPage } from './app.po';

describe('configurator App', () => {
  let page: ConfiguratorPage;

  beforeEach(() => {
    page = new ConfiguratorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
