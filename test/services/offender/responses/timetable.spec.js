const {
  Timetable,
} = require('../../../../server/services/offender/responses/timetable');

describe('Timetable', () => {
  it('Should generate a timetable for the specified range', () => {
    const timetable = Timetable.create({
      startDate: '2020-08-24',
      endDate: '2020-08-30',
    }).build();

    [
      '2020-08-24',
      '2020-08-25',
      '2020-08-26',
      '2020-08-27',
      '2020-08-28',
      '2020-08-29',
      '2020-08-30',
    ].forEach(date => expect(timetable.events[date]).to.exist);

    expect(timetable.hasEvents).to.equal(
      false,
      'Should not have set the hasEvents flag',
    );
  });

  it('Should generate a timetable row for each date', () => {
    const timetable = Timetable.create({
      startDate: '2020-08-24',
    }).build();

    expect(Object.keys(timetable.events).length).to.equal(
      1,
      'Should only create entries for dates in range',
    );

    expect(timetable.events['2020-08-24']).to.eql({
      title: 'Monday 24 August',
      morning: { finished: true, events: [] },
      afternoon: { finished: true, events: [] },
      evening: { finished: true, events: [] },
    });
  });

  it('Should add events to the timetable', () => {
    const baseEvent = {
      eventSourceDesc: 'A test event',
      eventLocation: 'A Wing',
      eventType: 'TEST',
    };

    const timetable = Timetable.create({
      startDate: '2020-08-24',
    })
      .addEvents([
        {
          ...baseEvent,
          startTime: '2020-08-24T11:30:30',
          endTime: '2020-08-24T12:30:30',
        },
        {
          ...baseEvent,
          startTime: '2020-08-24T13:30:30',
          endTime: '2020-08-24T14:30:30',
        },
        {
          ...baseEvent,
          startTime: '2020-08-24T17:30:30',
          endTime: '2020-08-24T18:30:30',
        },
      ])
      .build();

    expect(timetable.events['2020-08-24'].morning.events.length).to.equal(
      1,
      'Should add events to the morning when before midday',
    );

    expect(timetable.events['2020-08-24'].afternoon.events.length).to.equal(
      1,
      'Should add events to the afternoon when after midday',
    );

    expect(timetable.events['2020-08-24'].evening.events.length).to.equal(
      1,
      'Should add events to the evening when after 1700hrs',
    );

    expect(timetable.hasEvents).to.equal(
      true,
      'Should have set the hasEvents flag',
    );
  });

  it('Should set event states for today', () => {
    const clock = sinon.useFakeTimers({
      now: new Date('2020-08-24T08:00:00').getTime(),
    });

    const baseEvent = {
      eventSourceDesc: 'A test event',
      eventLocation: 'A Wing',
      eventType: 'TEST',
    };

    const timetable = Timetable.create({
      startDate: '2020-08-24',
    }).addEvents([
      {
        ...baseEvent,
        startTime: '2020-08-24T11:30:30',
        endTime: '2020-08-24T12:30:30',
      },
      {
        ...baseEvent,
        startTime: '2020-08-24T13:30:30',
        endTime: '2020-08-24T14:30:30',
      },
      {
        ...baseEvent,
        startTime: '2020-08-24T17:30:30',
        endTime: '2020-08-24T18:30:30',
      },
    ]);

    let t = timetable.build();

    expect(t.events['2020-08-24'].morning.finished).to.equal(
      false,
      'Should not be finished',
    );
    expect(t.events['2020-08-24'].afternoon.finished).to.equal(
      false,
      'Should not be finished',
    );
    expect(t.events['2020-08-24'].evening.finished).to.equal(
      false,
      'Should not be finished',
    );

    clock.now = new Date('2020-08-24T13:00:00').getTime();
    t = timetable.setEventStatesForToday().build();

    expect(t.events['2020-08-24'].morning.finished).to.equal(
      true,
      'Should be finished',
    );
    expect(t.events['2020-08-24'].afternoon.finished).to.equal(
      false,
      'Should not be finished',
    );
    expect(t.events['2020-08-24'].evening.finished).to.equal(
      false,
      'Should not be finished',
    );

    clock.now = new Date('2020-08-24T18:00:00').getTime();
    t = timetable.setEventStatesForToday().build();

    expect(t.events['2020-08-24'].morning.finished).to.equal(
      true,
      'Should be finished',
    );
    expect(t.events['2020-08-24'].afternoon.finished).to.equal(
      true,
      'Should be finished',
    );
    expect(t.events['2020-08-24'].evening.finished).to.equal(
      false,
      'Should not be finished',
    );

    clock.restore();
  });
});
