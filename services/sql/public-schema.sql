--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3 (Debian 11.3-1.pgdg90+1)
-- Dumped by pg_dump version 11.3 (Debian 11.3-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    status text DEFAULT 'accepted'::text,
    id uuid NOT NULL,
    email text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    address text,
    address2 text,
    avatar text,
    biography text,
    phone text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_field; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_field (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    field text NOT NULL,
    has_finished boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: admin_topic; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_topic (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    topic_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: answer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.answer (
    question_id uuid NOT NULL,
    answer text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback (
    content text NOT NULL,
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: question; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question (
    id uuid NOT NULL,
    question text NOT NULL,
    type text NOT NULL,
    creator_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    img_url text
);


--
-- Name: question_topic; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question_topic (
    id uuid NOT NULL,
    topic_id uuid NOT NULL,
    question_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: topic; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topic (
    id uuid NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    cover text,
    creator_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_published boolean DEFAULT false,
    is_featured boolean DEFAULT false
);


--
-- Name: topic_comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topic_comment (
    id uuid NOT NULL,
    topic_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    parent_comment_id uuid,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: topic_comment_rating; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topic_comment_rating (
    topic_comment_id uuid NOT NULL,
    rating text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: topic_field; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topic_field (
    id uuid NOT NULL,
    topic_id uuid NOT NULL,
    field text NOT NULL
);


--
-- Name: topic_rating; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topic_rating (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    topic_id uuid NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: topic_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topic_tag (
    id uuid NOT NULL,
    topic_id uuid NOT NULL,
    tag text NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: topic_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topic_user (
    email text NOT NULL,
    topic_id uuid NOT NULL,
    is_allowed boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_activity (
    id uuid NOT NULL,
    activity_type text NOT NULL,
    user_id uuid NOT NULL,
    note text,
    topic_id uuid,
    question_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    answer text,
    topic_session_id uuid,
    other_info text,
    topic_comment_id uuid
);


--
-- Name: enum_field; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enum_field (
    field text NOT NULL
);


--
-- Name: enum_question_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enum_question_type (
    question_type text NOT NULL
);


--
-- Name: enum_rating_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enum_rating_type (
    type text NOT NULL
);


--
-- Name: enum_topic_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enum_topic_tag (
    topic_tag text NOT NULL
);


--
-- Name: enum_user_activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enum_user_activity (
    user_activity text NOT NULL
);


--
-- Name: enum_user_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enum_user_status (
    user_status text NOT NULL
);


--
-- Name: notification_subscription; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_subscription (
    user_id uuid NOT NULL,
    subscription text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    topic_id uuid NOT NULL,
    type text DEFAULT 'solo'::text NOT NULL,
    creator_id uuid NOT NULL,
    current_user_id uuid
);


--
-- Name: session_question; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session_question (
    question_id uuid NOT NULL,
    session_id uuid NOT NULL
);


--
-- Name: session_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."session_user" (
    user_id uuid NOT NULL,
    session_id uuid NOT NULL
);


INSERT INTO public.enum_question_type (question_type) VALUES ('multiple_choice');
INSERT INTO public.enum_question_type (question_type) VALUES ('identification');
INSERT INTO public.enum_question_type (question_type) VALUES ('essay');

INSERT INTO public.enum_rating_type (type) VALUES ('upvote');
INSERT INTO public.enum_rating_type (type) VALUES ('downvote');

INSERT INTO public.enum_topic_tag (topic_tag) VALUES ('consistent');
INSERT INTO public.enum_topic_tag (topic_tag) VALUES ('relevant');
INSERT INTO public.enum_topic_tag (topic_tag) VALUES ('reliable');
INSERT INTO public.enum_topic_tag (topic_tag) VALUES ('verified');

INSERT INTO public.enum_user_activity (user_activity) VALUES ('view');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('take');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('search');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('edit');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('invite');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('play_against');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('rate');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('tag');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('login');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('logout');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('answer');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('click');
INSERT INTO public.enum_user_activity (user_activity) VALUES ('comment');

INSERT INTO public.enum_field (field) VALUES ('Business and Management');
INSERT INTO public.enum_field (field) VALUES ('Nursing');
INSERT INTO public.enum_field (field) VALUES ('Psychology');
INSERT INTO public.enum_field (field) VALUES ('Biology');
INSERT INTO public.enum_field (field) VALUES ('Engineering');
INSERT INTO public.enum_field (field) VALUES ('Education');
INSERT INTO public.enum_field (field) VALUES ('Communications');
INSERT INTO public.enum_field (field) VALUES ('Finance and Accounting');
INSERT INTO public.enum_field (field) VALUES ('Criminal Justice');
INSERT INTO public.enum_field (field) VALUES ('Anthropology and Sociology');
INSERT INTO public.enum_field (field) VALUES ('Computer Science');
INSERT INTO public.enum_field (field) VALUES ('English');
INSERT INTO public.enum_field (field) VALUES ('Economics');
INSERT INTO public.enum_field (field) VALUES ('Political Science');
INSERT INTO public.enum_field (field) VALUES ('History');
INSERT INTO public.enum_field (field) VALUES ('Kinesiology and Physical Therapy');
INSERT INTO public.enum_field (field) VALUES ('Health Professions');
INSERT INTO public.enum_field (field) VALUES ('Art');
INSERT INTO public.enum_field (field) VALUES ('Math');
INSERT INTO public.enum_field (field) VALUES ('Environmental Science');
INSERT INTO public.enum_field (field) VALUES ('Foreign Languages');
INSERT INTO public.enum_field (field) VALUES ('Design');
INSERT INTO public.enum_field (field) VALUES ('Trades and Personal Services');
INSERT INTO public.enum_field (field) VALUES ('International Relations');
INSERT INTO public.enum_field (field) VALUES ('Chemistry');
INSERT INTO public.enum_field (field) VALUES ('Agricultural Sciences');
INSERT INTO public.enum_field (field) VALUES ('Information Technology');
INSERT INTO public.enum_field (field) VALUES ('Performing Arts');
INSERT INTO public.enum_field (field) VALUES ('Engineering Technicians');
INSERT INTO public.enum_field (field) VALUES ('Food and Nutrition');
INSERT INTO public.enum_field (field) VALUES ('Religious Studies');
INSERT INTO public.enum_field (field) VALUES ('Film and Photography');
INSERT INTO public.enum_field (field) VALUES ('Music');
INSERT INTO public.enum_field (field) VALUES ('Physics');
INSERT INTO public.enum_field (field) VALUES ('Philosophy');
INSERT INTO public.enum_field (field) VALUES ('Architecture');
INSERT INTO public.enum_field (field) VALUES ('Protective Services');
INSERT INTO public.enum_field (field) VALUES ('Legal Studies');
INSERT INTO public.enum_field (field) VALUES ('Culinary Arts');
INSERT INTO public.enum_field (field) VALUES ('Pharmacy');
INSERT INTO public.enum_field (field) VALUES ('Dental Studies');
INSERT INTO public.enum_field (field) VALUES ('Arts Management');
INSERT INTO public.enum_field (field) VALUES ('Veterinary Studies');
INSERT INTO public.enum_field (field) VALUES ('Building and Construction');
INSERT INTO public.enum_field (field) VALUES ('Other');

INSERT INTO public.enum_user_status (user_status) VALUES ('accepted');
INSERT INTO public.enum_user_status (user_status) VALUES ('pending');
INSERT INTO public.enum_user_status (user_status) VALUES ('rejected');
INSERT INTO public.enum_user_status (user_status) VALUES ('deleted');

--
-- Name: admin_topic admin_topic_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_topic
    ADD CONSTRAINT admin_topic_pkey PRIMARY KEY (topic_id, user_id);


--
-- Name: answer choices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT choices_pkey PRIMARY KEY (id);


--
-- Name: enum_field enum_field_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enum_field
    ADD CONSTRAINT enum_field_pkey PRIMARY KEY (field);


--
-- Name: enum_question_type enum_question_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enum_question_type
    ADD CONSTRAINT enum_question_type_pkey PRIMARY KEY (question_type);


--
-- Name: enum_rating_type enum_rating_type_rating_vote_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enum_rating_type
    ADD CONSTRAINT enum_rating_type_rating_vote_key UNIQUE (type);


--
-- Name: enum_rating_type enum_rating_vote_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enum_rating_type
    ADD CONSTRAINT enum_rating_vote_pkey PRIMARY KEY (type);


--
-- Name: enum_topic_tag enum_topic_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enum_topic_tag
    ADD CONSTRAINT enum_topic_tag_pkey PRIMARY KEY (topic_tag);


--
-- Name: enum_user_activity enum_user_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enum_user_activity
    ADD CONSTRAINT enum_user_activity_pkey PRIMARY KEY (user_activity);


--
-- Name: enum_user_status enum_user_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enum_user_status
    ADD CONSTRAINT enum_user_status_pkey PRIMARY KEY (user_status);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: notification_subscription notification_subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_subscription
    ADD CONSTRAINT notification_subscription_pkey PRIMARY KEY (user_id, subscription);


--
-- Name: question question_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_pkey PRIMARY KEY (id);


--
-- Name: question_topic question_topic_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_topic
    ADD CONSTRAINT question_topic_pkey PRIMARY KEY (question_id, topic_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session_question session_question_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_question
    ADD CONSTRAINT session_question_pkey PRIMARY KEY (question_id, session_id);


--
-- Name: session_user session_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."session_user"
    ADD CONSTRAINT session_user_pkey PRIMARY KEY (user_id, session_id);


--
-- Name: topic_comment_rating topic_comment_like_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_comment_rating
    ADD CONSTRAINT topic_comment_like_pkey PRIMARY KEY (topic_comment_id, user_id);


--
-- Name: topic_comment topic_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_comment
    ADD CONSTRAINT topic_comment_pkey PRIMARY KEY (id);


--
-- Name: topic_field topic_field_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_field
    ADD CONSTRAINT topic_field_pkey PRIMARY KEY (field, topic_id);


--
-- Name: topic topic_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_pkey PRIMARY KEY (id);


--
-- Name: topic_rating topic_rating_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_rating
    ADD CONSTRAINT topic_rating_pkey PRIMARY KEY (topic_id, user_id);


--
-- Name: topic_tag topic_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_tag
    ADD CONSTRAINT topic_tag_pkey PRIMARY KEY (id, topic_id, user_id, tag);


--
-- Name: topic_user topic_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_user
    ADD CONSTRAINT topic_user_pkey PRIMARY KEY (email, topic_id);


--
-- Name: user_activity user_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_pkey PRIMARY KEY (id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user_field user_field_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_field
    ADD CONSTRAINT user_field_pkey PRIMARY KEY (field, user_id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: notification_subscription set_public_notification_subscription_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_notification_subscription_updated_at BEFORE UPDATE ON public.notification_subscription FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_notification_subscription_updated_at ON notification_subscription; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_notification_subscription_updated_at ON public.notification_subscription IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: session set_public_session_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_session_updated_at BEFORE UPDATE ON public.session FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_session_updated_at ON session; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_session_updated_at ON public.session IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: topic_comment_rating set_public_topic_comment_like_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_topic_comment_like_updated_at BEFORE UPDATE ON public.topic_comment_rating FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_topic_comment_like_updated_at ON topic_comment_rating; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_topic_comment_like_updated_at ON public.topic_comment_rating IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: topic_comment set_public_topic_comment_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_topic_comment_updated_at BEFORE UPDATE ON public.topic_comment FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_topic_comment_updated_at ON topic_comment; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_topic_comment_updated_at ON public.topic_comment IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: topic_user set_public_topic_user_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_topic_user_updated_at BEFORE UPDATE ON public.topic_user FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_topic_user_updated_at ON topic_user; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_topic_user_updated_at ON public.topic_user IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: admin_topic admin_topic_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_topic
    ADD CONSTRAINT admin_topic_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: admin_topic admin_topic_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_topic
    ADD CONSTRAINT admin_topic_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: answer choices_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT choices_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user_field field_field_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_field
    ADD CONSTRAINT field_field_fkey FOREIGN KEY (field) REFERENCES public.enum_field(field) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user_field field_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_field
    ADD CONSTRAINT field_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: notification_subscription notification_subscription_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_subscription
    ADD CONSTRAINT notification_subscription_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: question question_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: question_topic question_topic_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_topic
    ADD CONSTRAINT question_topic_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: question_topic question_topic_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question_topic
    ADD CONSTRAINT question_topic_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: question question_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_type_fkey FOREIGN KEY (type) REFERENCES public.enum_question_type(question_type) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: session session_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: session session_current_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_current_user_fkey FOREIGN KEY (current_user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: session_question session_question_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_question
    ADD CONSTRAINT session_question_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: session_question session_question_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_question
    ADD CONSTRAINT session_question_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.session(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: session session_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: session_user session_user_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."session_user"
    ADD CONSTRAINT session_user_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.session(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: session_user session_user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."session_user"
    ADD CONSTRAINT session_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_comment_rating topic_comment_like_rating_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_comment_rating
    ADD CONSTRAINT topic_comment_like_rating_fkey FOREIGN KEY (rating) REFERENCES public.enum_rating_type(type) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_comment_rating topic_comment_like_topic_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_comment_rating
    ADD CONSTRAINT topic_comment_like_topic_comment_id_fkey FOREIGN KEY (topic_comment_id) REFERENCES public.topic_comment(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_comment_rating topic_comment_like_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_comment_rating
    ADD CONSTRAINT topic_comment_like_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_comment topic_comment_parent_comment_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_comment
    ADD CONSTRAINT topic_comment_parent_comment_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.topic_comment(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_comment topic_comment_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_comment
    ADD CONSTRAINT topic_comment_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_comment topic_comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_comment
    ADD CONSTRAINT topic_comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic topic_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_field topic_field_field_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_field
    ADD CONSTRAINT topic_field_field_fkey FOREIGN KEY (field) REFERENCES public.enum_field(field) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_field topic_field_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_field
    ADD CONSTRAINT topic_field_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_rating topic_rating_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_rating
    ADD CONSTRAINT topic_rating_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_rating topic_rating_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_rating
    ADD CONSTRAINT topic_rating_type_fkey FOREIGN KEY (type) REFERENCES public.enum_rating_type(type) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_rating topic_rating_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_rating
    ADD CONSTRAINT topic_rating_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_tag topic_tag_tag_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_tag
    ADD CONSTRAINT topic_tag_tag_fkey FOREIGN KEY (tag) REFERENCES public.enum_topic_tag(topic_tag) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_tag topic_tag_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_tag
    ADD CONSTRAINT topic_tag_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_tag topic_tag_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_tag
    ADD CONSTRAINT topic_tag_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: topic_user topic_user_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topic_user
    ADD CONSTRAINT topic_user_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user_activity user_activity_activity_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_activity_type_fkey FOREIGN KEY (activity_type) REFERENCES public.enum_user_activity(user_activity) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user_activity user_activity_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user_activity user_activity_topic_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_topic_comment_id_fkey FOREIGN KEY (topic_comment_id) REFERENCES public.topic_comment(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user_activity user_activity_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user_activity user_activity_topic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_topic_session_id_fkey FOREIGN KEY (topic_session_id) REFERENCES public.session(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user_activity user_activity_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user user_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_status_fkey FOREIGN KEY (status) REFERENCES public.enum_user_status(user_status) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

