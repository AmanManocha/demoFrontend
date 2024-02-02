import { format } from 'date-fns';

export const formattedDate =(originalDate)=>{
    const formatted=format(originalDate, 'dd/MM/yyyy');
    return formatted;
} 