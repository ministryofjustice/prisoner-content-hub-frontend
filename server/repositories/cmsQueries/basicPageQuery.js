/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

// will need tests
class BasicPageQuery {
  constructor(location) {
    this.location = location;
    // possibly add includes here if we need to retrieve secondary tags and categories.
    this.query = new Query().getQueryString();
  }

  path() {
    return `${this.location}?${this.query}`;
  }

  transform(item) {
    console.log(item);
    // need to map to real data here.
    return {
      id: '10808',
      title: 'TV Guide Tuesday 2nd August to Sunday 8th August',
      contentType: 'page',
      // moving 'description.santised' -> 'content' and update the template
      description: {
        sanitized:
          '<p><strong>MONDAY 2 AUGUST</strong></p>\n\n<p><strong>BBC One</strong><br />\n6:00am Olympics 2020 9:00am Olympics 2020 12:00pm Would I ',
      },
      standFirst:
        'Here is this weeks TV Guide for the week of Monday 2nd August to Sunday 8th August',
      categories: [],
      // need to check with leon if any of the content does have categories/basic tags
      secondaryTags: [],
      secondaryTagNames: '',
      categoryNames: '',
    };
  }
}

module.exports = { BasicPageQuery };
