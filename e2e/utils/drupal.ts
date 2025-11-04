import { WiremockUtils } from './wiremock';
import * as primaryNavigationData from '../fixtures/drupalData/primaryNavigation.json';
import * as browseAllTopicsData from '../fixtures/drupalData/browseAllTopics.json';
import * as urgentBannersData from '../fixtures/drupalData/urgentBanners.json';

export class DrupalUtils {
  private wiremock: WiremockUtils;

  constructor() {
    this.wiremock = new WiremockUtils();
  }

  async stubPrimaryNavigation(): Promise<void> {
    await this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/drupal/en/jsonapi/prison/.*?/primary_navigation.*?',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: primaryNavigationData,
      },
    });
  }

  async stubBrowseAllTopics(): Promise<void> {
    await this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/drupal/en/jsonapi/prison/.*?/taxonomy_term.*?',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: browseAllTopicsData,
      },
    });
  }

  async stubUrgentBanners(): Promise<void> {
    await this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern: '/drupal/en/jsonapi/prison/.*?/node/urgent_banner.*?',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: urgentBannersData,
      },
    });
  }
}