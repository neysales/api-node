
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID NOT NULL, 
    name VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,    
    activity VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
    responsible VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
    address_street TEXT COLLATE pg_catalog."default",
    address_city TEXT COLLATE pg_catalog."default",
    address_state TEXT COLLATE pg_catalog."default",
    address_neighborhood TEXT COLLATE pg_catalog."default",
    address_zip TEXT COLLATE pg_catalog."default",
    address_country TEXT COLLATE pg_catalog."default",
    address_complement TEXT COLLATE pg_catalog."default",
    address_number TEXT COLLATE pg_catalog."default",
    phone_landline TEXT COLLATE pg_catalog."default",
    phone_mobile TEXT COLLATE pg_catalog."default",
    phone_whatsapp TEXT COLLATE pg_catalog."default",
    email VARCHAR(255) COLLATE pg_catalog."default",
    active BOOLEAN NOT NULL DEFAULT TRUE,
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    api_key UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::UUID,
    CONSTRAINT pk_companies PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.config(
    id UUID NOT NULL,
    company_id UUID NOT NULL,
    logo_url TEXT COLLATE pg_catalog."default",
    evolution_url TEXT COLLATE pg_catalog."default",
    evolution_key TEXT COLLATE pg_catalog."default",
    evolution_instance TEXT COLLATE pg_catalog."default",
    minio_bucket TEXT COLLATE pg_catalog."default",
    minio_port TEXT COLLATE pg_catalog."default",
    minio_access_key TEXT COLLATE pg_catalog."default",
    minio_secret_key TEXT COLLATE pg_catalog."default",
    minio_endpoint TEXT COLLATE pg_catalog."default",
    email TEXT COLLATE pg_catalog."default",
    email_password TEXT COLLATE pg_catalog."default",
    email_smtp TEXT COLLATE pg_catalog."default",
    email_port TEXT COLLATE pg_catalog."default",
    email_text_scheduled TEXT COLLATE pg_catalog."default",
    email_text_canceled TEXT COLLATE pg_catalog."default",
    email_text_confirmed TEXT COLLATE pg_catalog."default",
    email_text_rejected TEXT COLLATE pg_catalog."default",
    ai_provider TEXT COLLATE pg_catalog."default" DEFAULT 'openai',
    ai_api_key TEXT COLLATE pg_catalog."default",
    ai_model TEXT COLLATE pg_catalog."default" DEFAULT 'gpt-3.5-turbo',
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_config PRIMARY KEY (id),
    CONSTRAINT fk_config_company FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID NOT NULL,
    name VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE,
    birth_date DATE,
    phone_mobile TEXT COLLATE pg_catalog."default" NOT NULL,
    email VARCHAR(255) COLLATE pg_catalog."default" UNIQUE,
    address_street TEXT COLLATE pg_catalog."default",
    address_city TEXT COLLATE pg_catalog."default",
    address_state TEXT COLLATE pg_catalog."default",
    address_neighborhood TEXT COLLATE pg_catalog."default",
    address_zip TEXT COLLATE pg_catalog."default",
    address_country TEXT COLLATE pg_catalog."default",
    address_complement TEXT COLLATE pg_catalog."default",
    address_number TEXT COLLATE pg_catalog."default",
    notes TEXT COLLATE pg_catalog."default",
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    password TEXT COLLATE pg_catalog."default" NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    CONSTRAINT pk_clients PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.clients_companies (
    client_id UUID NOT NULL,
    company_id UUID NOT NULL,
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_clients_companies PRIMARY KEY (client_id, company_id),
    CONSTRAINT fk_clients_companies_client FOREIGN KEY (client_id)
        REFERENCES public.clients (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_clients_companies_company FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.specialties (
    id UUID NOT NULL,
    name VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
    description TEXT COLLATE pg_catalog."default" NOT NULL,
    company_id UUID NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_specialties PRIMARY KEY (id),
    CONSTRAINT fk_specialties_company FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.attendants (
    id UUID NOT NULL,
    name VARCHAR(150) COLLATE pg_catalog."default" NOT NULL,
    specialty_id UUID NOT NULL,
    company_id UUID NOT NULL,
    phone_mobile TEXT COLLATE pg_catalog."default" NOT NULL,
    email VARCHAR(255) COLLATE pg_catalog."default" NOT NULL,
    hiring_date TIMESTAMP WITH TIME ZONE NOT NULL,
    administrator BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_attendants PRIMARY KEY (id),
    CONSTRAINT fk_attendants_specialty FOREIGN KEY (specialty_id)
        REFERENCES public.specialties (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_attendants_company FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID NOT NULL,
    attendant_id UUID NOT NULL,
    day_of_week VARCHAR(20) COLLATE pg_catalog."default" NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_schedules PRIMARY KEY (id),
    CONSTRAINT fk_schedules_attendant FOREIGN KEY (attendant_id)
        REFERENCES public.attendants (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID NOT NULL,
    client_id UUID NOT NULL,
    company_id UUID NOT NULL,
    attendant_id UUID NOT NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    service_performed BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT COLLATE pg_catalog."default",
    status VARCHAR(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'scheduled',
    registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_appointments PRIMARY KEY (id),
    CONSTRAINT fk_appointments_client FOREIGN KEY (client_id)
        REFERENCES public.clients (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_appointments_company FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_appointments_attendant FOREIGN KEY (attendant_id)
        REFERENCES public.attendants (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
