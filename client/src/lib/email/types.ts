export interface HostInfo {
  name: string;
  email: string;
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