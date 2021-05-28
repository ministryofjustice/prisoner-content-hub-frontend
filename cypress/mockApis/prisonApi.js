const { stubFor } = require('./wiremock');

const stubOffenderDetails = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prisonapi/api/bookings/offenderNo/.+`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        bookingId: 14,
        firstName: 'John',
        lastName: 'Smith',
        agencyId: 'MDI',
      },
    },
  });
};

const stubEvents = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: `/prisonapi/api/bookings/.*?/events\\?fromDate=.*?&toDate=.*?`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventId: 438521867,
          eventStatus: 'SCH',
          eventType: 'PRISON_ACT',
          eventTypeDesc: 'Prison Activities',
          eventSubType: 'PA',
          eventSubTypeDesc: 'Prison Activities',
          eventDate: '2021-05-28',
          startTime: '2021-05-28T08:10:00',
          endTime: '2021-05-28T11:25:00',
          eventLocation: 'NEW EDUCATION',
          eventLocationId: 124814,
          eventSource: 'PA',
          eventSourceCode: 'EDU ICT AM',
          eventSourceDesc: 'EDU IT AM',
          paid: false,
          payRate: 1.21,
          locationCode: 'NEDUC',
        },
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventId: 438559093,
          eventStatus: 'SCH',
          eventType: 'PRISON_ACT',
          eventTypeDesc: 'Prison Activities',
          eventSubType: 'PA',
          eventSubTypeDesc: 'Prison Activities',
          eventDate: '2021-05-28',
          startTime: '2021-05-28T08:10:00',
          endTime: '2021-05-28T11:25:00',
          eventLocation: 'MAIN EXERCISE YARD',
          eventLocationId: 124830,
          eventSource: 'PA',
          eventSourceCode: 'SUSPEND',
          eventSourceDesc: 'SUSPENDED ACTIVITY',
          paid: false,
          payRate: 0.01,
          locationCode: 'MAINEX',
        },
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventId: 438561726,
          eventStatus: 'SCH',
          eventType: 'PRISON_ACT',
          eventTypeDesc: 'Prison Activities',
          eventSubType: 'PA',
          eventSubTypeDesc: 'Prison Activities',
          eventDate: '2021-05-28',
          startTime: '2021-05-28T08:10:00',
          endTime: '2021-05-28T11:25:00',
          eventLocation: 'NEW EDUCATION',
          eventLocationId: 124814,
          eventSource: 'PA',
          eventSourceCode: 'TV PROD',
          eventSourceDesc: 'TV PRODUCTION',
          paid: false,
          payRate: 1.21,
          locationCode: 'NEDUC',
        },
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventStatus: 'SCH',
          eventType: 'APP',
          eventTypeDesc: 'Appointment',
          eventSubType: 'GYMF',
          eventSubTypeDesc: 'Gym - Football',
          eventDate: '2021-05-28',
          startTime: '2021-05-28T20:20:00',
          endTime: '2021-05-28T20:50:00',
          eventLocation: 'E WING GYM PORTAKABIN (NO 6)',
          eventSource: 'APP',
          eventSourceCode: 'APP',
          eventSourceDesc: 'dadsdas',
        },
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventStatus: 'SCH',
          eventType: 'APP',
          eventTypeDesc: 'Appointment',
          eventSubType: 'CALA',
          eventSubTypeDesc: 'Case - Legal Aid',
          eventDate: '2021-05-28',
          startTime: '2021-05-28T22:10:00',
          endTime: '2021-05-28T22:45:00',
          eventLocation: 'BODY REPAIR',
          eventSource: 'APP',
          eventSourceCode: 'APP',
        },
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventStatus: 'SCH',
          eventType: 'APP',
          eventTypeDesc: 'Appointment',
          eventSubType: 'GYMF',
          eventSubTypeDesc: 'Gym - Football',
          eventDate: '2021-05-29',
          startTime: '2021-05-29T20:20:00',
          endTime: '2021-05-29T20:50:00',
          eventLocation: 'E WING GYM PORTAKABIN (NO 6)',
          eventSource: 'APP',
          eventSourceCode: 'APP',
          eventSourceDesc: 'dadsdas',
        },
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventStatus: 'SCH',
          eventType: 'APP',
          eventTypeDesc: 'Appointment',
          eventSubType: 'CALA',
          eventSubTypeDesc: 'Case - Legal Aid',
          eventDate: '2021-05-29',
          startTime: '2021-05-29T22:10:00',
          endTime: '2021-05-29T22:45:00',
          eventLocation: 'BODY REPAIR',
          eventSource: 'APP',
          eventSourceCode: 'APP',
        },
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventStatus: 'SCH',
          eventType: 'APP',
          eventTypeDesc: 'Appointment',
          eventSubType: 'GYMF',
          eventSubTypeDesc: 'Gym - Football',
          eventDate: '2021-05-30',
          startTime: '2021-05-30T20:20:00',
          endTime: '2021-05-30T20:50:00',
          eventLocation: 'E WING GYM PORTAKABIN (NO 6)',
          eventSource: 'APP',
          eventSourceCode: 'APP',
          eventSourceDesc: 'dadsdas',
        },
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventStatus: 'SCH',
          eventType: 'APP',
          eventTypeDesc: 'Appointment',
          eventSubType: 'CALA',
          eventSubTypeDesc: 'Case - Legal Aid',
          eventDate: '2021-05-30',
          startTime: '2021-05-30T22:10:00',
          endTime: '2021-05-30T22:45:00',
          eventLocation: 'BODY REPAIR',
          eventSource: 'APP',
          eventSourceCode: 'APP',
        },
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventStatus: 'SCH',
          eventType: 'PRISON_ACT',
          eventTypeDesc: 'Prison Activities',
          eventSubType: 'PA',
          eventSubTypeDesc: 'Prison Activities',
          eventDate: '2021-05-31',
          startTime: '2021-05-31T08:10:00',
          endTime: '2021-05-31T11:25:00',
          eventLocation: 'MAIN EXERCISE YARD',
          eventLocationId: 124830,
          eventSource: 'PA',
          eventSourceCode: 'SUSPEND',
          eventSourceDesc: 'SUSPENDED ACTIVITY',
          paid: false,
          locationCode: 'MAINEX',
        },
        {
          bookingId: 6699,
          eventClass: 'INT_MOV',
          eventStatus: 'SCH',
          eventType: 'PRISON_ACT',
          eventTypeDesc: 'Prison Activities',
          eventSubType: 'PA',
          eventSubTypeDesc: 'Prison Activities',
          eventDate: '2021-05-31',
          startTime: '2021-05-31T08:10:00',
          endTime: '2021-05-31T11:25:00',
          eventLocation: 'NEW EDUCATION',
          eventLocationId: 124814,
          eventSource: 'PA',
          eventSourceCode: 'TV PROD',
          eventSourceDesc: 'TV PRODUCTION',
          paid: false,
          locationCode: 'NEDUC',
        },
      ],
    },
  });
};

module.exports = {
  stubOffenderDetails,
  stubEvents,
};
