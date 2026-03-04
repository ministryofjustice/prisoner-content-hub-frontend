import { test, expect } from '@playwright/test';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';
import { VideoNavigationPage } from '../../../framework/pages/video/videoNavigationPage';

const berwynPrison = PRISONS.find(prison => prison.id === 'berwyn');

test.describe('Feature: Video content tile navigation - Berwyn', () => {
  test.skip(!berwynPrison, 'Berwyn prison configuration not found');
  test.skip(process.env.USE_DEV_ENV !== 'true', 'Requires dev environment for video playback');

  const baseURL = berwynPrison ? testSetup.getBaseURL(berwynPrison) : '';

  test.beforeEach(async () => {
    await testSetup.reset();
    await testSetup.stubPrisonerSignIn();
  });

  test('Scenario: Homepage video tile navigates to content page', async ({ page }) => {
    const videoNavigationPage = new VideoNavigationPage(page);

    await test.step('Given I am on the Berwyn Prisoner Content Hub homepage', async () => {
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Then a video tile should be visible', async () => {
      await videoNavigationPage.ensureVideoTileVisible();
      await expect(videoNavigationPage.videoTile).toBeVisible();
      await expect(videoNavigationPage.videoTileWatchLabel).toHaveText(/Watch/i);
    });

    await test.step('When I open the video tile', async () => {
      await videoNavigationPage.ensureVideoTileVisible();
      await videoNavigationPage.openVideoTile();
    });

    await test.step('Then I should be on the video content page', async () => {
      await expect(page).toHaveURL(/\/content\//);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    await test.step('And the video should be able to play', async () => {
      await expect(videoNavigationPage.videoPlayer).toBeVisible();

      const videoHandle = await videoNavigationPage.videoPlayer.elementHandle();
      if (!videoHandle) {
        throw new Error('Video element not found');
      }

      await videoHandle.evaluate(async (video) => {
        const element = video as any;
        element.muted = true;
        await element.play();
      });

      await page.waitForFunction(
        (video) => {
          const element = video as any;
          return !element.paused && element.currentTime > 0;
        },
        videoHandle,
        { timeout: 15000 }
      );
    });
  });
});
