const { groupBy, sortBy } = require('../index');

describe('Utils', () => {
  describe('groupBy', () => {
    it('empty', () => {
      expect(groupBy([], i => i)).toStrictEqual({});
    });
    it('some values', () => {
      expect(groupBy(['a', 'bb', 'ccc', 'dd'], i => i.length)).toStrictEqual({
        1: ['a'],
        2: ['bb', 'dd'],
        3: ['ccc'],
      });
    });
  });

  describe('sortBy', () => {
    let contacts;
    let contactA;
    let contactB;
    let contactC;
    const key = 'firstName';
    const secondSortKey = 'lastName';

    beforeEach(() => {
      contacts = [];
      contactA = {
        firstName: 'a',
        lastName: 'b',
      };
      contactB = {
        firstName: 'b',
        lastName: 'b',
      };
      contactC = {
        firstName: 'c',
        lastName: 'a',
      };
    });

    it('should not re-order the values', () => {
      contacts = [contactA, contactA];

      expect(contacts.sort(sortBy(key))).toStrictEqual([contactA, contactA]);
    });

    it('should re-order the values and return them in the expected order', () => {
      contacts = [contactC, contactB];

      expect(contacts.sort(sortBy(key))).toStrictEqual([contactB, contactC]);
    });

    it('should re-order the values and return them in the expected order', () => {
      contacts = [contactB, contactA];

      expect(contacts.sort(sortBy(key))).toStrictEqual([contactA, contactB]);
    });

    it('should sort contacts by lastName, where lastNames match, contacts should be further sorted by firstName', () => {
      contacts = [contactB, contactC, contactA];

      contacts = contacts.sort(sortBy(key)).sort(sortBy(secondSortKey));

      expect(contacts).toStrictEqual([contactC, contactA, contactB]);
    });
  });
});
