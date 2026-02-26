import { Page, Locator } from '@playwright/test';

export class VideoNavigationPage {
  readonly page: Page;
  readonly videoTile: Locator;
  readonly videoTileHeading: Locator;
  readonly videoTileWatchLabel: Locator;
  readonly videoPlayer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.videoTileWatchLabel = page.locator('.content-link--video').first();
    this.videoTile = this.videoTileWatchLabel.locator('xpath=ancestor::a[1]');
    this.videoTileHeading = this.videoTile.locator('h3.govuk-heading-l');
    this.videoPlayer = page.locator('#hub-video');
  }

  async openVideoTile() {
    await this.videoTile.click();
  }

  async ensureVideoTileVisible() {
    await this.videoTileWatchLabel.scrollIntoViewIfNeeded();
    await this.videoTile.waitFor({ state: 'visible' });
    await this.videoTileWatchLabel.waitFor({ state: 'visible' });
  }
}
