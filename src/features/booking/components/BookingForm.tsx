import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CalendarCheck } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import {
  useSiteContent,
  type Translate
} from "../../../shared/hooks/useSiteContent";
import { bookingTimes } from "../../../shared/utils/formatDate";
import { trackAnalyticsEvent } from "../../../shared/analytics/ga4";

const createSchema = (t: Translate) => z
  .object({
    fullName: z.string().min(2, t("validation.fullNameRequired", "Full name is required")),
    phoneNumber: z.string().optional(),
    facebook: z.string().optional(),
    email: z.string().email(t("validation.invalidEmail", "Invalid email")).optional().or(z.literal("")),
    serviceName: z.string().trim().min(1, t("validation.serviceRequired", "Service is required")),
    serviceId: z.string().optional(),
    durationMinutes: z.coerce.number().refine(
      (value) => [60, 90, 120].includes(value),
      t("validation.durationRequired", "Duration is required")
    ),
    numberOfPeople: z.coerce.number().min(1, t("validation.peopleRequired", "At least 1 person")),
    arrivalDate: z.string().min(1, t("validation.arrivalDateRequired", "Arrival date is required")),
    arrivalTime: z.string().optional(),
    note: z.string().optional()
  })
  .superRefine((value, context) => {
    if (!value.phoneNumber?.trim() && !value.email?.trim() && !value.facebook?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: t(
          "validation.contactRequired",
          "Please provide a phone/WhatsApp number, email or Facebook."
        ),
        path: ["phoneNumber"]
      });
    }
  });

type BookingFormValues = z.infer<ReturnType<typeof createSchema>>;

export function BookingForm() {
  const { brand, spaPackages, spaServices, t } = useSiteContent();
  const schema = useMemo(() => createSchema(t), [t]);
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedStart = useRef(false);
  const selectedPackage = searchParams.get("package");
  const selectedService = searchParams.get("service");

  const serviceOptions = useMemo(
    () => spaServices.map((service) => ({
      id: service.id,
      label: service.name,
      duration: service.durationMinutes,
      type: "Service"
    })),
    [spaServices]
  );
  const options = useMemo(() => {
    const packageOptions = spaPackages.map((item) => ({
      id: item.id,
      label: item.name,
      duration: item.durationMinutes,
      type: "Package"
    }));
    return [...serviceOptions, ...packageOptions];
  }, [serviceOptions, spaPackages]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceName: "",
      serviceId: "",
      durationMinutes: 60,
      numberOfPeople: 1,
      arrivalTime: "10:00"
    }
  });

  const serviceId = watch("serviceId");
  const serviceName = watch("serviceName");
  const matchServiceOption = (query: string) => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return options.find(
      (item) => item.label.trim().toLocaleLowerCase() === normalizedQuery
    );
  };
  const selected =
    options.find((item) => item.id === serviceId) ?? matchServiceOption(serviceName);

  useEffect(() => {
    const requestedId = selectedPackage ?? selectedService;
    const requested = requestedId ? options.find((item) => item.id === requestedId) : undefined;
    if (!requested) return;

    setValue("serviceId", requested.id);
    setValue("serviceName", requested.label);
    if (requested.duration) setValue("durationMinutes", requested.duration);
  }, [options, selectedPackage, selectedService, setValue]);

  const submitBooking = async (values: BookingFormValues) => {
    setSubmitError("");
    setIsSubmitting(true);
    const analyticsService = selected?.id ?? "custom_request";
    const analyticsServiceType = selected?.type ?? "Custom request";
    const analyticsDetails = {
      service_id: analyticsService,
      service_type: analyticsServiceType
    };
    trackAnalyticsEvent("booking_submit_attempt", analyticsDetails);
    let analyticsErrorStage = "network";
    let analyticsErrorCode = "network";
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          serviceId: selected?.id ?? values.serviceName.trim(),
          serviceName: values.serviceName.trim(),
          serviceType: selected?.type ?? "Custom request",
          createdAtClient: new Date().toISOString(),
          clientMeta: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
          }
        })
      });

      if (!response.ok) {
        analyticsErrorStage = "api";
        analyticsErrorCode = `http_${response.status}`;
        const payload = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(payload.message ?? t("booking.sendError", "Cannot send booking email."));
      }

      trackAnalyticsEvent("generate_lead", {
        ...analyticsDetails,
        lead_source: "website_booking"
      });
      setSubmitted(true);
    } catch (error) {
      trackAnalyticsEvent("booking_error", {
        ...analyticsDetails,
        stage: analyticsErrorStage,
        error_code: analyticsErrorCode
      });
      setSubmitError(
        error instanceof Error
          ? error.message
          : t("booking.sendError", "Cannot send booking email.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackValidationError = () => {
    trackAnalyticsEvent("booking_error", {
      service_id: selected?.id ?? "custom_request",
      service_type: selected?.type ?? "Custom request",
      stage: "validation",
      error_code: "invalid_form"
    });
  };

  return (
    <div className="rounded-lg border border-blush bg-ivory p-5 shadow-soft lg:p-8">
      {submitted ? (
        <div className="grid min-h-80 place-items-center text-center">
          <div>
            <CalendarCheck className="mx-auto h-14 w-14 text-terracotta" />
            <h2 className="mt-5 font-display text-3xl font-bold text-cocoa">
              {t("booking.success.title", "Thank you for your booking request.")}
            </h2>
            <p className="mt-4 max-w-xl text-taupe">
              {t(
                "booking.success.description",
                "Fiona Massage & Spa will contact you soon via your selected channel to confirm your appointment."
              )}
            </p>
            <a href={brand.phoneHref} className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3 font-bold text-white">
              {t("booking.callHotline", "Call {hotline}", { hotline: brand.hotline })}
            </a>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(submitBooking, trackValidationError)}
          onFocusCapture={() => {
            if (hasTrackedStart.current) return;
            hasTrackedStart.current = true;
            trackAnalyticsEvent("booking_start", {
              service_id: selected?.id,
              service_type: selected?.type
            });
          }}
          className="grid gap-5 lg:grid-cols-2"
        >
          {submitError ? (
            <div className="flex gap-3 rounded-lg border border-terracotta/30 bg-blush p-4 text-sm font-semibold text-copper lg:col-span-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {submitError}
            </div>
          ) : null}

          <Field
            label={t("booking.fullNameRepresentative", "Full name / Representative")}
            error={errors.fullName?.message}
            required
          >
            <input
              {...register("fullName")}
              autoComplete="name"
              className="form-input"
              placeholder={t("form.yourName", "Your name")}
            />
          </Field>

          <Field label={t("form.numberOfPeople", "Number of people")} error={errors.numberOfPeople?.message} required>
            <input type="number" min={1} {...register("numberOfPeople")} className="form-input" />
          </Field>

          <Field
            label={t("form.phoneWhatsapp", "Số điện thoại/Whatsapp")}
            error={errors.phoneNumber?.message}
          >
            <input
              {...register("phoneNumber")}
              autoComplete="tel"
              className="form-input"
              placeholder="+84 941333184"
            />
          </Field>

          <Field label={t("form.email", "Email")} error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="form-input"
              placeholder="name@email.com"
            />
          </Field>

          <Field label="Facebook" error={errors.facebook?.message}>
            <input
              {...register("facebook")}
              autoComplete="url"
              className="form-input"
              placeholder={t("form.facebookPlaceholder", "Facebook profile or username")}
            />
          </Field>

          <Field label={t("form.service", "Service")} error={errors.serviceName?.message} required>
            <input type="hidden" {...register("serviceId")} />
            <input
              {...register("serviceName", {
                onChange: (event) => {
                  const next = matchServiceOption(event.target.value);
                  setValue("serviceId", next?.id ?? "");
                  if (next?.duration) setValue("durationMinutes", next.duration);
                }
              })}
              type="text"
              list="booking-service-options"
              autoComplete="off"
              aria-autocomplete="list"
              aria-invalid={Boolean(errors.serviceName)}
              className="form-input"
              placeholder={t("form.servicePlaceholder", "Type or choose a service")}
            />
            <datalist id="booking-service-options">
              {serviceOptions.map((item) => (
                <option key={item.id} value={item.label} />
              ))}
            </datalist>
          </Field>

          <Field label={t("form.duration", "Duration")} error={errors.durationMinutes?.message} required>
            <select {...register("durationMinutes")} className="form-input">
              {[60, 90, 120].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t("form.arrivalDate", "Arrival date")} error={errors.arrivalDate?.message} required>
            <input type="date" {...register("arrivalDate")} className="form-input" />
          </Field>

          <Field label={t("form.arrivalTime", "Arrival time")} error={errors.arrivalTime?.message}>
            <select {...register("arrivalTime")} className="form-input">
              <option value="">{t("form.flexible", "Flexible")}</option>
              {bookingTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t("form.note", "Note / special request")} error={errors.note?.message} wide>
            <textarea {...register("note")} className="form-input min-h-32 resize-y" placeholder={t("form.notePlaceholder", "Massage pressure, allergies, group note...")} />
          </Field>

          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-terracotta px-7 py-4 font-bold text-white hover:bg-copper disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting
                ? t("common.sending", "Sending...")
                : t("common.bookNow", "Book Now")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  wide?: boolean;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, error, wide, required, children }: FieldProps) {
  return (
    <label className={`grid gap-2 ${wide ? "lg:col-span-2" : ""}`}>
      <span className="text-sm font-bold text-cocoa">
        {label}
        {required ? <span className="text-terracotta"> *</span> : null}
      </span>
      {children}
      {error ? <span className="text-sm font-semibold text-terracotta">{error}</span> : null}
    </label>
  );
}
