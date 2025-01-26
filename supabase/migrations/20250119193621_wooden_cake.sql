-- Script de inicialização do banco de dados
BEGIN;

-- Criação do banco de dados se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'agendero') THEN
        CREATE DATABASE agendero;
    END IF;
END
$$;

-- Conecta ao banco agendero
\c agendero;

-- Criação das tabelas
CREATE TABLE IF NOT EXISTS public."Companies"
(
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "Name" text NOT NULL,
    "Activity" text NOT NULL,
    "Responsible" text NOT NULL,
    "Address_Street" text,
    "Address_City" text,
    "Address_State" text,
    "Address_PostalCode" text,
    "Address_Country" text,
    "Address_AdditionalInfo" text,
    "Address_Number" text,
    "PhoneNumber" text,
    "MobileNumber" text,
    "Email" text,
    "Logo" text,
    "IsActive" boolean NOT NULL,
    "RegistrationDate" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ApiKey" uuid NOT NULL DEFAULT gen_random_uuid(),
    CONSTRAINT "PK_Companies" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS public."Customers"
(
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "Name" character varying(100) NOT NULL,
    "MobileNumber" text NOT NULL,
    "Email" character varying(255),
    "RegistratioDate" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Password" text NOT NULL,
    CONSTRAINT "PK_Customers" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS public."Specialties"
(
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "Name" text NOT NULL,
    "Description" text NOT NULL,
    "CompanyId" uuid NOT NULL,
    CONSTRAINT "PK_Specialties" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Specialties_Companies_CompanyId" FOREIGN KEY ("CompanyId")
        REFERENCES public."Companies" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public."Attendants"
(
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "Name" character varying(100) NOT NULL,
    "SpecialtyId" uuid NOT NULL,
    "CompanyId" uuid NOT NULL,
    "MobileNumber" text NOT NULL,
    "Email" character varying(255) NOT NULL,
    "HiringDate" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "IsAdmin" boolean NOT NULL DEFAULT false,
    CONSTRAINT "PK_Attendants" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Attendants_Companies_CompanyId" FOREIGN KEY ("CompanyId")
        REFERENCES public."Companies" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Attendants_Specialties_SpecialtyId" FOREIGN KEY ("SpecialtyId")
        REFERENCES public."Specialties" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public."Appointments"
(
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "CustomerId" uuid NOT NULL,
    "CompanyId" uuid NOT NULL,
    "AttendantId" uuid NOT NULL,
    "AppointmentDate" timestamp with time zone NOT NULL,
    "IsServiceDone" boolean NOT NULL DEFAULT false,
    CONSTRAINT "PK_Appointments" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Appointments_Customers_CustomerId" FOREIGN KEY ("CustomerId")
        REFERENCES public."Customers" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Appointments_Companies_CompanyId" FOREIGN KEY ("CompanyId")
        REFERENCES public."Companies" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Appointments_Attendants_AttendantId" FOREIGN KEY ("AttendantId")
        REFERENCES public."Attendants" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public."CustomerCompanies"
(
    "CustomerId" uuid NOT NULL,
    "CompanyId" uuid NOT NULL,
    CONSTRAINT "PK_CustomerCompanies" PRIMARY KEY ("CustomerId", "CompanyId"),
    CONSTRAINT "FK_CustomerCompanies_Customers_CustomerId" FOREIGN KEY ("CustomerId")
        REFERENCES public."Customers" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_CustomerCompanies_Companies_CompanyId" FOREIGN KEY ("CompanyId")
        REFERENCES public."Companies" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public."Schedules"
(
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "AttendantId" uuid NOT NULL,
    "DayOfWeek" text NOT NULL,
    "StartTime" timestamp with time zone NOT NULL,
    "EndTime" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Schedules" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Schedules_Attendants_AttendantId" FOREIGN KEY ("AttendantId")
        REFERENCES public."Attendants" ("Id") ON DELETE CASCADE
);

-- Criação dos índices
CREATE INDEX IF NOT EXISTS "IX_Appointments_AttendantId" ON public."Appointments"("AttendantId");
CREATE INDEX IF NOT EXISTS "IX_Appointments_CompanyId" ON public."Appointments"("CompanyId");
CREATE INDEX IF NOT EXISTS "IX_Appointments_CustomerId" ON public."Appointments"("CustomerId");
CREATE INDEX IF NOT EXISTS "IX_Attendants_CompanyId" ON public."Attendants"("CompanyId");
CREATE INDEX IF NOT EXISTS "IX_Attendants_SpecialtyId" ON public."Attendants"("SpecialtyId");
CREATE INDEX IF NOT EXISTS "IX_CustomerCompanies_CompanyId" ON public."CustomerCompanies"("CompanyId");
CREATE INDEX IF NOT EXISTS "IX_Specialties_CompanyId" ON public."Specialties"("CompanyId");

COMMIT;