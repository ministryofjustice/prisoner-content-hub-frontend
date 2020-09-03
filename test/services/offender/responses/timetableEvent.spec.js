const {
  TimetableEvent,
} = require('../../../../server/services/offender/responses/timetableEvent');

const DEFAULT_VALUE = 'Unavailable';

describe('TimetableEvent', () => {
  it('Should handle an empty response', () => {
    const timetableEvent = TimetableEvent.from();

    expect(timetableEvent.description).to.not.exist;
    expect(timetableEvent.startTime).to.not.exist;
    expect(timetableEvent.endTime).to.not.exist;
    expect(timetableEvent.location).to.not.exist;
    expect(timetableEvent.eventType).to.not.exist;
    expect(timetableEvent.finished).to.not.exist;
    expect(timetableEvent.status).to.not.exist;
    expect(timetableEvent.paid).to.not.exist;

    const formatted = timetableEvent.format();

    expect(formatted.description).to.equal(DEFAULT_VALUE);
    expect(formatted.startTime).to.equal('', 'Should return an empty string');
    expect(formatted.endTime).to.equal('', 'Should return an empty string');
    expect(formatted.location).to.equal(DEFAULT_VALUE);
    expect(formatted.timeString).to.equal('', 'Should return an empty string');
    expect(formatted.eventType).to.equal(DEFAULT_VALUE);
    expect(formatted.finished).to.equal(true, 'Should return a boolean value');
    expect(formatted.status).to.equal(DEFAULT_VALUE);
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
});
