export interface HostInfo {
  name: string;
  email: string;
  timezone: string | null;
}

export interface GuestInfo {
  name: string;
  email: string;
}

export interface AppointmentInfo {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
}

export interface BookingEmailData {
  host: HostInfo;
  guest: GuestInfo;
  appointment: AppointmentInfo;
}

export interface BookingApprovedEmailData
  extends BookingEmailData {
  calendarToken: string;
}

export interface BookingRescheduledData {
  host: HostInfo;
  guest: GuestInfo;

  oldAppointment: AppointmentInfo;
  newAppointment: AppointmentInfo;
}

export interface AppointmentInfo {
  id: string;

  title: string;
  date: string;
  startTime: string;
  endTime: string;

  meetingLink?: string;
}