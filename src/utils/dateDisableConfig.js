import moment from 'moment';

export const  disabledDate = (current) => {
    // Disable dates after today
    return current && current > moment().endOf('day');
  }

  export const disabledDateTime = (current) => {
    // Disable times after the current time for the selected date
    const today = moment();
    const currentDateTime = moment(current);
    return currentDateTime.isAfter(today);
  }