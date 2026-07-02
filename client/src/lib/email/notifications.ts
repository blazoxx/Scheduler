import React from "react";
import { safeSendEmail } from "./safeSendEmail";

import {
  BookingEmailData,
  BookingRescheduledData,
} from "./types";

import HostBookingRequested from "./templates/host/BookingRequested";
import GuestBookingRequestReceived from "./templates/guest/BookingRequestReceived";

import HostBookingApproved from "./templates/host/BookingApproved";
import GuestBookingApproved from "./templates/guest/BookingApproved";

import HostBookingRejected from "./templates/host/BookingRejected";
import GuestBookingRejected from "./templates/guest/BookingRejected";

import HostBookingCancelled from "./templates/host/BookingCancelled";
import GuestBookingCancelled from "./templates/guest/BookingCancelled";

import HostBookingRescheduled from "./templates/host/BookingRescheduled";
import GuestBookingRescheduled from "./templates/guest/BookingRescheduled";

/* ------------------------------ */
/* Booking Requested */
/* ------------------------------ */

export async function sendBookingRequestedToHost(
  data: BookingEmailData
) {
  return safeSendEmail({
    to: data.host.email,
    subject: "New Appointment Request",
    react: React.createElement(
      HostBookingRequested,
      data
    ),
  });
}

export async function sendBookingRequestReceivedToGuest(
  data: BookingEmailData
) {
  return safeSendEmail({
    to: data.guest.email,
    subject: "Appointment Request Received",
    react: React.createElement(
      GuestBookingRequestReceived,
      data
    ),
  });
}

/* ------------------------------ */
/* Booking Approved */
/* ------------------------------ */

export async function sendBookingApprovedToHost(
  data: BookingEmailData
) {
  return safeSendEmail({
    to: data.host.email,
    subject: "Appointment Approved",
    react: React.createElement(
      HostBookingApproved,
      data
    ),
  });
}

export async function sendBookingApprovedToGuest(
  data: BookingEmailData
) {
  return safeSendEmail({
    to: data.guest.email,
    subject: "Appointment Confirmed",
    react: React.createElement(
      GuestBookingApproved,
      data
    ),
  });
}

/* ------------------------------ */
/* Booking Rejected */
/* ------------------------------ */

export async function sendBookingRejectedToHost(
  data: BookingEmailData
) {
  return safeSendEmail({
    to: data.host.email,
    subject: "Appointment Rejected",
    react: React.createElement(
      HostBookingRejected,
      data
    ),
  });
}

export async function sendBookingRejectedToGuest(
  data: BookingEmailData
) {
  return safeSendEmail({
    to: data.guest.email,
    subject: "Appointment Request Declined",
    react: React.createElement(
      GuestBookingRejected,
      data
    ),
  });
}

/* ------------------------------ */
/* Booking Cancelled */
/* ------------------------------ */

export async function sendBookingCancelledToHost(
  data: BookingEmailData
) {
  return safeSendEmail({
    to: data.host.email,
    subject: "Appointment Cancelled",
    react: React.createElement(
      HostBookingCancelled,
      data
    ),
  });
}

export async function sendBookingCancelledToGuest(
  data: BookingEmailData
) {
  return safeSendEmail({
    to: data.guest.email,
    subject: "Appointment Cancelled",
    react: React.createElement(
      GuestBookingCancelled,
      data
    ),
  });
}

/* ------------------------------ */
/* Booking Rescheduled */
/* ------------------------------ */

export async function sendBookingRescheduledToHost(
  data: BookingRescheduledData
) {
  return safeSendEmail({
    to: data.host.email,
    subject: "Appointment Rescheduled",
    react: React.createElement(
      HostBookingRescheduled,
      data
    ),
  });
}

export async function sendBookingRescheduledToGuest(
  data: BookingRescheduledData
) {
  return safeSendEmail({
    to: data.guest.email,
    subject: "Appointment Rescheduled",
    react: React.createElement(
      GuestBookingRescheduled,
      data
    ),
  });
}

export async function sendBookingApproved(
  to: string,
  data: {
    clientName: string;
    clientEmail: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    meetingLink?: string;
  }
) {
  return sendBookingApprovedToGuest({
    host: { name: "Host", email: to },
    guest: { name: data.clientName, email: data.clientEmail || to },
    appointment: {
      title: data.title,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      meetingLink: data.meetingLink,
    },
  });
}

export async function sendBookingRejected(
  to: string,
  data: {
    clientName: string;
    clientEmail: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  }
) {
  return sendBookingRejectedToGuest({
    host: { name: "Host", email: to },
    guest: { name: data.clientName, email: data.clientEmail || to },
    appointment: {
      title: data.title,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });
}