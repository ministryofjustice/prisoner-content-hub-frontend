const config = require('../config');
const { logger } = require('../utils/logger');
const { isEmptyResponse, fillContentItems } = require('../utils');

const {
  contentResponseFrom,
  mediaResponseFrom,
  seasonResponseFrom,
  termResponseFrom,
  landingResponseFrom,
  flatPageContentFrom,
  typeFrom,
  pdfResponseFrom,
} = require('../utils/adapters');

const hubContentRepository = httpClient => {
  async function contentFor(id, establishmentId) {
    const endpoint = `${config.api.hubContent}/${id}`;

    if (!id) {
      logger.info(`HubContentRepository (contentFor) - No ID passed`);
      return null;
    }
    const query = {
      _prison: establishmentId,
    };

    const response = await httpClient.get(endpoint, { query });

    if (isEmptyResponse(response)) {
      logger.error(`HubContentRepository (contentFor) - Empty response`);
      return null;
    }

    return parseResponse(response);
  }

  async function termFor(id, establishmentId) {
    const endpoint = `${config.api.hubTerm}/${id}`;

    if (!id) {
      logger.info(`HubContentRepository (termFor) - No ID passed`);
      return null;
    }

    const query = {
      _prison: establishmentId,
    };

    const response = await httpClient.get(endpoint, { query });

    if (isEmptyResponse(response)) {
      logger.error(`HubContentRepository (termFor) - Empty response`);
      return null;
    }

    return termResponseFrom(response);
  }

  async function seasonFor({
    id,
    establishmentId,
    perPage = 40,
    offset = 0,
  } = {}) {
    const endpoint = `${config.api.series}/${id}`;
    const query = {
      _number: perPage,
      _offset: offset,
      _prison: establishmentId,
    };

    if (!id) {
      logger.info(`HubContentRepository (seasonFor) - No ID passed`);
      return [];
    }

    const response = await httpClient.get(endpoint, { query });

    if (!Array.isArray(response)) {
      return [];
    }

    return fillContentItems(seasonResponseFrom(response));
  }

  async function relatedContentFor({
    id,
    establishmentId,
    perPage = 40,
    offset = 0,
    sortOrder = 'DESC',
  } = {}) {
    const endpoint = `${config.api.hubContent}/related`;
    const query = {
      _category: id,
      _number: perPage,
      _offset: offset,
      _prison: establishmentId,
      _sort_order: sortOrder,
    };

    if (!id) {
      logger.info(`HubContentRepository (relatedContentFor) - No ID passed`);
      return [];
    }

    const response = await httpClient.get(endpoint, { query });

    if (!Array.isArray(response)) return [];

    return fillContentItems(contentResponseFrom(response));
  }

  function parseResponse(data) {
    const contentType = typeFrom(data.content_type);

    switch (contentType) {
      case 'video':
      case 'radio':
        return mediaResponseFrom(data);
      case 'page':
        return flatPageContentFrom(data);
      case 'landing-page':
        return landingResponseFrom(data);
      case 'pdf':
        return pdfResponseFrom(data);
      default:
        return null;
    }
  }

  async function streamFor(url) {
    return httpClient.get(url, {
      responseType: 'stream',
    });
  }

  return {
    contentFor,
    termFor,
    seasonFor,
    relatedContentFor,
    streamFor,
  };
};

module.exports = {
  contentRepository: hubContentRepository,
};
