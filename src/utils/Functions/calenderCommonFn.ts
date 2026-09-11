import moment from 'moment';
import 'moment-timezone';
import { momentLocalizer } from 'react-big-calendar';

moment.tz.setDefault('UTC'); //to show utc time in calendars
export const calendarLocalizer = momentLocalizer(moment);

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault('UTC') // page crashes when clicking on
// const localizer = dayjsLocalizer(dayjs);

export const customStyles = `
.rbc-today {
    background-color: #d4bbfc;
    opacity: 0.5
  },
  .rbc-day-bg {
    &.disabled {
      background-color: #f0f0f0;
      pointer-events: none;
      opacity: 0.5;
    }
  }
`;

// .rbc-event {
//     border: none;
//     box-sizing: border-box;
//     box-shadow: none;
//     margin: 0;
//     padding: $event-padding;
//     background-color: #800080;
//     border-radius: $event-border-radius;
//     color: #800080;
//     cursor: pointer;
//     width: 100%;
//     text-align: left;

//     .rbc-slot-selecting & {
//       cursor: inherit;
//       pointer-events: none;
//     }

//     &.rbc-selected {
//       background-color: darken($event-bg, 10%);
//     }

//     &:focus {
//       outline: 5px auto $event-outline;
//     }
//   }

export const customVehicleEditCalendarStyles = `
.rbc-toolbar button {
 background-color:#800080 ;
 color: white;
}

.rbc-toolbar button:hover {
 background-color: #d4bbfc;
 color: black; 
}
.rbc-today {
 background-color: #d4bbfc;
},
.rbc-time-view {
 border: 1px solid black;
},
}
`;
