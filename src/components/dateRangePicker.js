import React, { useReducer } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { formattedDate } from './dateFormat';

const DateRange = ({onDateChange}) => {

  const [localState, setLocalState]= useReducer(
    (prevState, newState) => ({...prevState, ...newState}),
    {
      startDate: new Date(),
      endDate: new Date(),
      key:'selection',
    })

    const { startDate, endDate , key}= localState;
    const  handleSelect=(selectedDateRange)=>{
   const startDateCopy=selectedDateRange?.selection?.startDate;
   const endDateCopy=selectedDateRange?.selection?.endDate;
    setLocalState({startDate:startDateCopy,endDate:endDateCopy,key:selectedDateRange?.selection?.key})
    onDateChange(formattedDate(startDateCopy), formattedDate(endDateCopy));
  }
  
  const selectionRange = {
    startDate,
    endDate,
    key,
  }
  const maxDate=new Date();
  maxDate.setDate(startDate.getDate() +15);


  console.log("startDate: ",formattedDate(startDate),"endDate: ",formattedDate(endDate))
  return (
    <DateRangePicker
        ranges={[selectionRange]}
        minDate={startDate} //min date should start from today
        maxDate={maxDate} //validation for max date to be max 15 days ahead of current date
        onChange={handleSelect}
        direction="horizontal"
      />
  );
}

export default DateRange;


