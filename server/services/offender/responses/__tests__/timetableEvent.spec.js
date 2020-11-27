const { TimetableEvent } = require('../timetableEvent');
const {
  placeholders: { DEFAULT },
} = require('../../../../utils/enums');

describe('TimetableEvent', () => {
  it('Should handle an empty response', () => {
    const timetableEvent = TimetableEvent.from();

    expect(timetableEvent.description).not.toBeDefined();
    expect(timetableEvent.startTime).not.toBeDefined();
    expect(timetableEvent.endTime).not.toBeDefined();
    expect(timetableEvent.location).not.toBeDefined();
    expect(timetableEvent.eventType).not.toBeDefined();
    expect(timetableEvent.eventSubType).not.toBeDefined();
    expect(timetableEvent.eventSubTypeDesc).not.toBeDefined();
    expect(timetableEvent.finished).not.toBeDefined();
    expect(timetableEvent.status).not.toBeDefined();
    expect(timetableEvent.paid).not.toBeDefined();

    const formatted = timetableEvent.format();

    expect(formatted.description).toBe(DEFAULT);
    expect(formatted.startTime).toBe('', 'Should return an empty string');
    expect(formatted.endTime).toBe('', 'Should return an empty string');
    expect(formatted.location).toBe(DEFAULT);
    expect(formatted.timeString).toBe('', 'Should return an empty string');
    expect(formatted.eventType).toBe(DEFAULT);
    expect(formatted.finished).toBe(true, 'Should return a boolean value');
    expect(formatted.status).toBe(DEFAULT);
    expect(formatted.paid).not.toBeDefined();
  });

  it('should handle an incomplete response', () => {
    const response = {
      startTime: '2020-08-24T11:30:30',
      eventSourceDesc: 'A test event',
      eventLocation: 'A Wing',
      eventType: 'TEST',
      eventSubType: 'SBTYPE',
      eventSubTypeDesc: 'Test Sub Type Desc',
      eventStatus: 'SCH',
      paid: true,
    };

    const formatted = TimetableEvent.from(response).format();

    expect(formatted).toStrictEqual(
      {
        description: 'A test event',
        startTime: '11:30AM',
        endTime: '',
        location: 'A wing',
        timeString: '11:30AM',
        eventType: 'Test Sub Type Desc',
        finished: false,
        status: 'SCH',
        paid: true,
      },
      'Should handle being provided no end time',
    );
  });

  it('should format data when passed for a non-PA eventSubType', () => {
    const response = {
      startTime: '2020-08-24T11:30:30',
      endTime: '2020-08-24T12:30:30',
      eventSourceDesc: 'A test event',
      eventLocation: 'A Wing',
      eventType: 'TEST',
      eventSubType: 'SBTYPE',
      eventSubTypeDesc: 'Test Sub Type Desc',
      eventStatus: 'SCH',
      paid: true,
    };

    const formatted = TimetableEvent.from(response).format();

    expect(formatted).toStrictEqual({
      description: 'A test event',
      startTime: '11:30AM',
      endTime: '12:30PM',
      location: 'A wing',
      timeString: '11:30AM to 12:30PM',
      eventType: 'Test Sub Type Desc',
      finished: false,
      status: 'SCH',
      paid: true,
    });
  });

  it('should format data when passed for a PA eventSubType', () => {
    const response = {
      startTime: '2020-08-24T11:30:30',
      endTime: '2020-08-24T12:30:30',
      eventSourceDesc: 'A test event',
      eventLocation: 'A Wing',
      eventSubType: 'PA',
      eventSubTypeDesc: 'Test Sub Type Desc',
      eventStatus: 'SCH',
      paid: true,
    };

    const formatted = TimetableEvent.from(response).format();

    expect(formatted).toStrictEqual({
      description: 'A test event',
      startTime: '11:30AM',
      endTime: '12:30PM',
      location: 'A wing',
      timeString: '11:30AM to 12:30PM',
      eventType: 'A test event',
      finished: false,
      status: 'SCH',
      paid: true,
    });
  });
});
