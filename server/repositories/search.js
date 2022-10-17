const { pathOr, view, lensPath } = require('ramda');
const esb = require('elastic-builder');
const config = require('../config');

function searchResultFrom({ _id, _source }) {
  const idFrom = text => text.match(/\d+/)[0];
  const titleFrom = view(lensPath(['title', 0]));
  const summaryFrom = view(lensPath(['summary', 0]));
  return {
    title: titleFrom(_source),
    summary: summaryFrom(_source),
    url: `/content/${idFrom(_id)}`,
  };
}

function searchRepository(httpClient, logger) {
  async function find({ query, from = 0, limit = 15, establishmentName }) {
    logger.info(`SEARCH find >>>> ${query} ${limit} ${establishmentName}`);
    const esbRequest = esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .must(
            esb
              .multiMatchQuery(
                [
                  'title^5',
                  'title.keyword^5',
                  'stand_first^4',
                  'stand_first.keyword^4',
                  'series_name^3',
                  'series_name.keyword^3',
                  'category_name^3',
                  'category_name.keyword^3',
                  'secondary_tag^3',
                  'secondary_tag.keyword^3',
                  'summary^1',
                  'summary.keyword^1',
                ],
                query,
              )
              .type('best_fields')
              .prefixLength(1)
              .fuzziness(3)
              .operator('and'),
          )
          .should([
            esb.termQuery('prison_name.keyword', establishmentName),
            esb.boolQuery().mustNot([esb.existsQuery('prison_name.keyword')]),
          ])
          .minimumShouldMatch(1),
      )
      .size(limit)
      .from(from)
      .toJSON();
    logger.info(
      `SEARCH FIND esbRequest: ${JSON.stringify(esbRequest, null, 2)}`,
    );
    const response = await httpClient.post(
      config.elasticsearch.search,
      esbRequest,
    );

    const results = pathOr([], ['hits', 'hits'], response);
    return results.map(searchResultFrom);
  }

  async function typeAhead({ query, limit = 5, establishmentName }) {
    logger.info(`SEARCH typeAhead >>>> ${query} ${limit} ${establishmentName}`);
    const esbRequest = esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .must(
            esb
              .boolQuery()
              .should([
                esb
                  .multiMatchQuery(
                    [
                      'title^5',
                      'title.keyword^5',
                      'stand_first^4',
                      'stand_first.keyword^4',
                      'series_name^3',
                      'series_name.keyword^3',
                      'category_name^3',
                      'category_name.keyword^3',
                      'secondary_tag^3',
                      'secondary_tag.keyword^3',
                      'summary^1',
                      'summary.keyword^1',
                    ],
                    query,
                  )
                  .type('cross_fields')
                  .operator('and'),
                esb
                  .multiMatchQuery(
                    [
                      'title^5',
                      'title.keyword^5',
                      'stand_first^4',
                      'stand_first.keyword^4',
                      'series_name^3',
                      'series_name.keyword^3',
                      'category_name^3',
                      'category_name.keyword^3',
                      'secondary_tag^3',
                      'secondary_tag.keyword^3',
                      'summary^1',
                      'summary.keyword^1',
                    ],
                    query,
                  )
                  .type('best_fields')
                  .prefixLength(1)
                  .fuzziness(3)
                  .operator('and'),
              ])
              .minimumShouldMatch(1),
          )
          .should([
            esb.termQuery('prison_name.keyword', establishmentName),
            esb.boolQuery().mustNot([esb.existsQuery('prison_name.keyword')]),
          ])
          .minimumShouldMatch(1),
      )
      .size(limit)
      .timeout('15ms')
      .toJSON();
    logger.info(
      `SEARCH TYPEAHEAD esbRequest: ${JSON.stringify(esbRequest, null, 2)}`,
    );

    const response = await httpClient.post(
      config.elasticsearch.search,
      esbRequest,
    );

    const results = pathOr([], ['hits', 'hits'], response);
    return results.map(searchResultFrom);
  }

  return {
    find,
    typeAhead,
  };
}

module.exports = {
  searchRepository,
};
