const { pathEq, propEq, path, not, compose } = require('ramda');

const statuses = {
  UP: 'UP',
  DOWN: 'DOWN',
  PARTIALLY_DEGRADED: 'PARTIALLY_DEGRADED',
};

function createHealthService({ client, config, logger }) {
  const { UP, DOWN, PARTIALLY_DEGRADED } = statuses;

  function allOk(...args) {
    const statusIsOkay = s => s === UP;
    const all = args.every(statusIsOkay);
    const some = args.some(statusIsOkay);

    if (all) {
      return UP;
    }

    if (some) {
      return PARTIALLY_DEGRADED;
    }

    return DOWN;
  }

  async function getDrupalHealth() {
    const drupalUrl = path(['api', 'hubHealth'], config);
    const result = await client.get(drupalUrl);
    const isUp = pathEq(['db', 'status'], 'up');

    return {
      drupal: isUp(result) ? UP : DOWN,
    };
  }

  async function getElasticSearchHealth() {
    const elasticsearchUrl = path(['elasticsearch', 'health'], config);
    const result = await client.get(elasticsearchUrl);
    const isUp = compose(not, propEq('status', 'red'));

    return {
      elasticsearch: isUp(result) ? UP : DOWN,
    };
  }

  async function status() {
    try {
      const hubStatus = await getDrupalHealth();
      const elasticSearchStatus = await getElasticSearchHealth();

      return {
        status: allOk(hubStatus.drupal, elasticSearchStatus.elasticsearch),
        dependencies: {
          ...hubStatus,
          ...elasticSearchStatus,
        },
      };
    } catch (e) {
      logger.error(e);
      return {
        status: DOWN,
        dependencies: {
          drupal: DOWN,
          elasticsearch: DOWN,
        },
      };
    }
  }

  return { status };
}

module.exports = {
  statuses,
  createHealthService,
};
