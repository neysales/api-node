CREATE TABLE IF NOT EXISTS public."Appointments"
(
    "Id" uuid NOT NULL,
    "CustomerId" uuid NOT NULL,
    "CompanyId" uuid NOT NULL,
    "AttendantId" uuid NOT NULL,
    "AppointmentDate" timestamp with time zone NOT NULL,
    "IsServiceDone" boolean NOT NULL,
    CONSTRAINT "PK_Appointments" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS public."Attendants"
(
    "Id" uuid NOT NULL,
    "Name" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "SpecialtyId" uuid NOT NULL,
    "CompanyId" uuid NOT NULL,
    "MobileNumber" text COLLATE pg_catalog."default" NOT NULL,
    "Email" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "HiringDate" timestamp with time zone NOT NULL,
    "IsAdmin" boolean NOT NULL DEFAULT false,
    CONSTRAINT "PK_Attendants" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS public."Companies"
(
    "Id" uuid NOT NULL,
    "Name" text COLLATE pg_catalog."default" NOT NULL,
    "Activity" text COLLATE pg_catalog."default" NOT NULL,
    "Responsible" text COLLATE pg_catalog."default" NOT NULL,
    "Address_Street" text COLLATE pg_catalog."default",
    "Address_City" text COLLATE pg_catalog."default",
    "Address_State" text COLLATE pg_catalog."default",
    "Address_District" text COLLATE pg_catalog."default",
    "Address_PostalCode" text COLLATE pg_catalog."default",
    "Address_Country" text COLLATE pg_catalog."default",
    "Address_AdditionalInfo" text COLLATE pg_catalog."default",
    "Address_Number" text COLLATE pg_catalog."default",
    "PhoneNumber" text COLLATE pg_catalog."default",
    "MobileNumber" text COLLATE pg_catalog."default",
    "Email" text COLLATE pg_catalog."default",
    "Logo" text COLLATE pg_catalog."default",
    "IsActive" boolean NOT NULL,
    "RegistrationDate" timestamp with time zone NOT NULL,
    "ApiKey" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    CONSTRAINT "PK_Companies" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS public."CustomerCompanies"
(
    "CustomerId" uuid NOT NULL,
    "CompanyId" uuid NOT NULL,
    CONSTRAINT "PK_CustomerCompanies" PRIMARY KEY ("CustomerId", "CompanyId")
);

CREATE TABLE IF NOT EXISTS public."Customers"
(
    "Id" uuid NOT NULL,
    "Name" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "MobileNumber" text COLLATE pg_catalog."default" NOT NULL,
    "Email" character varying(255) COLLATE pg_catalog."default",
    "RegistratioDate" timestamp with time zone NOT NULL,
    "Password" text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK_Customers" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS public."Schedules"
(
    "Id" uuid NOT NULL,
    "AttendantId" uuid NOT NULL,
    "DayOfWeek" text COLLATE pg_catalog."default" NOT NULL,
    "StartTime" timestamp with time zone NOT NULL,
    "EndTime" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Schedules" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS public."Specialties"
(
    "Id" uuid NOT NULL,
    "Name" text COLLATE pg_catalog."default" NOT NULL,
    "Description" text COLLATE pg_catalog."default" NOT NULL,
    "CompanyId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    CONSTRAINT "PK_Specialties" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS public."__EFMigrationsHistory"
(
    "MigrationId" character varying(150) COLLATE pg_catalog."default" NOT NULL,
    "ProductVersion" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

ALTER TABLE IF EXISTS public."Appointments"
    ADD CONSTRAINT "FK_Appointments_Attendants_AttendantId" FOREIGN KEY ("AttendantId")
    REFERENCES public."Attendants" ("Id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IX_Appointments_AttendantId"
    ON public."Appointments"("AttendantId");

ALTER TABLE IF EXISTS public."Appointments"
    ADD CONSTRAINT "FK_Appointments_Companies_CompanyId" FOREIGN KEY ("CompanyId")
    REFERENCES public."Companies" ("Id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IX_Appointments_CompanyId"
    ON public."Appointments"("CompanyId");

ALTER TABLE IF EXISTS public."Appointments"
    ADD CONSTRAINT "FK_Appointments_Customers_CustomerId" FOREIGN KEY ("CustomerId")
    REFERENCES public."Customers" ("Id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IX_Appointments_CustomerId"
    ON public."Appointments"("CustomerId");

ALTER TABLE IF EXISTS public."Attendants"
    ADD CONSTRAINT "FK_Attendants_Companies_CompanyId" FOREIGN KEY ("CompanyId")
    REFERENCES public."Companies" ("Id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IX_Attendants_CompanyId"
    ON public."Attendants"("CompanyId");

ALTER TABLE IF EXISTS public."Attendants"
    ADD CONSTRAINT "FK_Attendants_Specialties_SpecialtyId" FOREIGN KEY ("SpecialtyId")
    REFERENCES public."Specialties" ("Id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IX_Attendants_SpecialtyId"
    ON public."Attendants"("SpecialtyId");

ALTER TABLE IF EXISTS public."CustomerCompanies"
    ADD CONSTRAINT "FK_CustomerCompanies_Companies_CompanyId" FOREIGN KEY ("CompanyId")
    REFERENCES public."Companies" ("Id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IX_CustomerCompanies_CompanyId"
    ON public."CustomerCompanies"("CompanyId");

ALTER TABLE IF EXISTS public."CustomerCompanies"
    ADD CONSTRAINT "FK_CustomerCompanies_Customers_CustomerId" FOREIGN KEY ("CustomerId")
    REFERENCES public."Customers" ("Id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."Specialties"
    ADD CONSTRAINT "FK_Specialties_Companies_CompanyId" FOREIGN KEY ("CompanyId")
    REFERENCES public."Companies" ("Id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IX_Specialties_CompanyId"
    ON public."Specialties"("CompanyId");
