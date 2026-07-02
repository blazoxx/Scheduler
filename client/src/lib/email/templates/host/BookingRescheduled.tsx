import { Text } from "@react-email/components";
import EmailLayout from "@/src/lib/email/templates/layout/EmailLayout";
import AppointmentDetails from "@/src/lib/email/templates/layout/AppointmentDetails";
import { BookingRescheduledData } from "../../types";

export default function BookingRescheduled({
  host,
  guest,
  oldAppointment,
  newAppointment,
}: BookingRescheduledData) {
  return (
    <EmailLayout
      preview="Appointment rescheduled"
      title="Appointment Rescheduled"
    >
      <Text>Hello {host.name},</Text>

      <Text>
        Your appointment with <strong>{guest.name}</strong> has been rescheduled.
      </Text>

      <AppointmentDetails
        heading="Previous Appointment"
        title={oldAppointment.title}
        date={oldAppointment.date}
        startTime={oldAppointment.startTime}
        endTime={oldAppointment.endTime}
      />

      <AppointmentDetails
        heading="New Appointment"
        title={newAppointment.title}
        date={newAppointment.date}
        startTime={newAppointment.startTime}
        endTime={newAppointment.endTime}
      />
    </EmailLayout>
  );
}
