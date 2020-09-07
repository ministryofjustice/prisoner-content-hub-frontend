const {
  TimetableEvent,
} = require('../../../../server/services/offender/responses/timetableEvent');
const {
  placeholders: { DEFAULT },
} = require('../../../../server/utils/enums');

describe('TimetableEvent', () => {
  it('Should handle an empty response', () => {
    const timetableEvent = TimetableEvent.from();

    expect(timetableEvent.description).to.not.exist;
    expect(timetableEvent.startTime).to.not.exist;
    expect(timetableEvent.endTime).to.not.exist;
    expect(timetableEvent.location).to.not.exist;
    expect(timetableEvent.type).to.not.exist;
    expect(timetableEvent.finished).to.not.exist;
    expect(timetableEvent.status).to.not.exist;
    expect(timetableEvent.paid).to.not.exist;

    const formatted = timetableEvent.format();

    expect(formatted.description).to.equal(DEFAULT);
    expect(formatted.startTime).to.equal('', 'Should return an empty string');
    expect(formatted.endTime).to.equal('', 'Should return an empty string');
    expect(formatted.location).to.equal(DEFAULT);
    expect(formatted.timeString).to.equal('', 'Should return an empty string');
    expect(formatted.eventType).to.equal(DEFAULT);
    expect(formatted.finished).to.equal(true, 'Should return a boolean value');
    expect(formatted.status).to.equal(DEFAULT);
    expect(formatted.paid).to.not.exist;
  });

  it('should handle an incomplete response', () => {
    const response = {
      startTime: '2020-08-24T11:30:30',
      eventSourceDesc: 'A test event',
      eventLocation: 'A Wing',
      eventType: 'TEST',
      eventStatus: 'SCH',
      paid: true,
    };

    const formatted = TimetableEvent.from(response).format();

    expect(formatted).to.eql(
      {
        description: 'A test event',
        startTime: '11:30AM',
        endTime: '',
        location: 'A wing',
        timeString: '11:30AM',
        eventType: 'TEST',
        finished: false,
        status: 'SCH',
        paid: true,
      },
      'Should handle being provided no end time',
    );
  });

  it('should format data when passed', () => {
    const response = {
      startTime: '2020-08-24T11:30:30',
      endTime: '2020-08-24T12:30:30',
      eventSourceDesc: 'A test event',
      eventLocation: 'A Wing',
      eventType: 'TEST',
      eventStatus: 'SCH',
      paid: true,
    };

    const formatted = TimetableEvent.from(response).format();

    expect(formatted).to.eql({
      description: 'A test event',
      startTime: '11:30AM',
      endTime: '12:30PM',
      location: 'A wing',
      timeString: '11:30AM to 12:30PM',
      eventType: 'TEST',
      finished: false,
      status: 'SCH',
      paid: true,
    });
  });

  describe('filterByType', () => {
    it('should filter by a single type', () => {
      const filter = TimetableEvent.filterByType('FOO');

      const ofType = new TimetableEvent({ type: 'FOO' });
      const notOfType = new TimetableEvent({ type: 'BAR' });

      expect(filter(ofType)).to.equal(true);
      expect(filter(notOfType)).to.equal(false);
    });
    it('should filter by multiple types', () => {
      const filter = TimetableEvent.filterByType('FOO', 'BAR');

      const ofType = new TimetableEvent({ type: 'FOO' });
      const ofAnotherType = new TimetableEvent({ type: 'BAR' });
      const notOfType = new TimetableEvent({ type: 'BAZ' });

      expect(filter(ofType)).to.equal(true);
      expect(filter(ofAnotherType)).to.equal(true);
      expect(filter(notOfType)).to.equal(false);
    });
  });
});
