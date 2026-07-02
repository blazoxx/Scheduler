export interface BookingEmailProps {
  hostName?: string;
  clientName: string;
  clientEmail: string;

  title: string;

  date: string;

  startTime: string;
  endTime: string;

  meetingLink?: string;

  reason?: string;
}

export interface BookingRescheduledProps {
  clientName: string;

  title: string;

  oldDate: string;
  oldStartTime: string;
  oldEndTime: string;

  newDate: string;
  newStartTime: string;
  newEndTime: string;
}