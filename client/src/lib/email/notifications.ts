import React from "react";
import { safeSendEmail } from "./safeSendEmail";
import BookingRequested from "./templates/BookingRequested";
import BookingApproved from "./templates/BookingApproved";
import BookingRejected from "./templates/BookingRejected";
import BookingCancelled from "./templates/BookingCancelled";
import BookingRescheduled from "./templates/BookingRescheduled";
import { BookingEmailProps, BookingRescheduledProps } from "./types";

export async function sendBookingRescheduled(
    to: string,
    data: BookingRescheduledProps
) {
    return safeSendEmail({
        to,
        subject: "Appointment Rescheduled",
        react: React.createElement(
            BookingRescheduled,
            data
        ),
    });
}

export async function sendBookingCancelled(
    to: string,
    data: BookingEmailProps
) {
    return safeSendEmail({
        to,
        subject: "Appointment Cancelled",
        react: React.createElement(
            BookingCancelled,
            data
        ),
    });
}

export async function sendBookingRejected(
    to: string,
    data: BookingEmailProps
) {
    return safeSendEmail({
        to,
        subject: "Appointment Declined",
        react: React.createElement(
            BookingRejected,
            data
        ),
    });
}

export async function sendBookingApproved(
    to: string,
    data: BookingEmailProps
) {
    return safeSendEmail({
        to,
        subject: "Appointment Confirmed",
        react: React.createElement(
            BookingApproved,
            data
        ),
    });
}

export async function sendBookingRequested(
    to: string,
    data: BookingEmailProps
) {
    return safeSendEmail({
        to,
        subject: "New Appointment Request",
        react: React.createElement(
            BookingRequested,
            data
        ),
    });
}