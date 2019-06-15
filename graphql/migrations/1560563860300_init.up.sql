SET xmloption = content;
CREATE TABLE public.admin_topic (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    topic_id uuid NOT NULL
);
CREATE TABLE public.question (
    id uuid NOT NULL,
    question text NOT NULL,
    type text NOT NULL,
    creator_id uuid NOT NULL,
    answer text NOT NULL
);
CREATE TABLE public.question_topic (
    id uuid NOT NULL,
    topic_id uuid NOT NULL,
    question_id uuid NOT NULL
);
CREATE TABLE public.topic (
    id uuid NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    cover text,
    creator_id uuid NOT NULL,
    uri text NOT NULL
);
CREATE TABLE public.topic_rating (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    topic_id uuid NOT NULL,
    type text NOT NULL
);
CREATE TABLE public.topic_tag (
    id uuid NOT NULL,
    topic_id uuid NOT NULL,
    tag text NOT NULL,
    user_id uuid NOT NULL
);
CREATE TABLE public."user" (
    status text NOT NULL,
    id uuid NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    address text NOT NULL,
    address2 text,
    avatar text,
    biography text,
    phone text
);
CREATE TABLE public.user_activity (
    id uuid NOT NULL,
    activity_type text NOT NULL,
    user_id uuid NOT NULL,
    note text,
    topic_id uuid NOT NULL,
    question_id uuid NOT NULL
);
CREATE TABLE public.user_course (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    user_course text NOT NULL,
    has_finished boolean DEFAULT false
);
CREATE TABLE public.enum_question_type (
    question_type text NOT NULL
);
CREATE TABLE public.enum_rating_type (
    type text NOT NULL
);
CREATE TABLE public.enum_topic_tag (
    topic_tag text NOT NULL
);
CREATE TABLE public.enum_user_activity (
    user_activity text NOT NULL
);
CREATE TABLE public.enum_user_course (
    user_course text NOT NULL
);
CREATE TABLE public.enum_user_status (
    user_status text NOT NULL
);

INSERT INTO public.enum_question_type (question_type) VALUES ('multiple_choice');

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

INSERT INTO public.enum_user_course (user_course) VALUES ('Bachelor of Science in Pharmacy (BS Pharmacy)');
INSERT INTO public.enum_user_course (user_course) VALUES ('Bachelor of Science in Business Administration Major in Business Economics (BSBA)');
INSERT INTO public.enum_user_course (user_course) VALUES ('Bachelor of Science in Medical Technology (BS Med Tech)');
INSERT INTO public.enum_user_course (user_course) VALUES ('Bachelor of Science in Nursing (BSN)');
INSERT INTO public.enum_user_course (user_course) VALUES ('Bachelor of Science in Accountancy (BSA)');
INSERT INTO public.enum_user_course (user_course) VALUES ('Bachelor of Science in Physical Therapy (BSPT)');
INSERT INTO public.enum_user_course (user_course) VALUES ('Bachelor in Secondary Education (BSED)');

INSERT INTO public.enum_user_status (user_status) VALUES ('accepted');
INSERT INTO public.enum_user_status (user_status) VALUES ('pending');
INSERT INTO public.enum_user_status (user_status) VALUES ('rejected');
INSERT INTO public.enum_user_status (user_status) VALUES ('deleted');

ALTER TABLE ONLY public.admin_topic
    ADD CONSTRAINT admin_topic_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.enum_question_type
    ADD CONSTRAINT enum_question_type_pkey PRIMARY KEY (question_type);
ALTER TABLE ONLY public.enum_rating_type
    ADD CONSTRAINT enum_rating_type_rating_vote_key UNIQUE (type);
ALTER TABLE ONLY public.enum_rating_type
    ADD CONSTRAINT enum_rating_vote_pkey PRIMARY KEY (type);
ALTER TABLE ONLY public.enum_topic_tag
    ADD CONSTRAINT enum_topic_tag_pkey PRIMARY KEY (topic_tag);
ALTER TABLE ONLY public.enum_user_activity
    ADD CONSTRAINT enum_user_activity_pkey PRIMARY KEY (user_activity);
ALTER TABLE ONLY public.enum_user_course
    ADD CONSTRAINT enum_user_course_pkey PRIMARY KEY (user_course);
ALTER TABLE ONLY public.enum_user_status
    ADD CONSTRAINT enum_user_status_pkey PRIMARY KEY (user_status);
ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.question_topic
    ADD CONSTRAINT question_topic_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_creator_id_key UNIQUE (creator_id);
ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.topic_rating
    ADD CONSTRAINT topic_rating_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.topic_tag
    ADD CONSTRAINT topic_tag_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_uri_key UNIQUE (uri);
ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_course
    ADD CONSTRAINT user_course_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.admin_topic
    ADD CONSTRAINT admin_topic_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.admin_topic
    ADD CONSTRAINT admin_topic_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.question_topic
    ADD CONSTRAINT question_topic_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.question_topic
    ADD CONSTRAINT question_topic_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_type_fkey FOREIGN KEY (type) REFERENCES public.enum_question_type(question_type) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.topic
    ADD CONSTRAINT topic_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.topic_rating
    ADD CONSTRAINT topic_rating_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.topic_rating
    ADD CONSTRAINT topic_rating_type_fkey FOREIGN KEY (type) REFERENCES public.enum_rating_type(type) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.topic_rating
    ADD CONSTRAINT topic_rating_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.topic_tag
    ADD CONSTRAINT topic_tag_tag_fkey FOREIGN KEY (tag) REFERENCES public.enum_topic_tag(topic_tag) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.topic_tag
    ADD CONSTRAINT topic_tag_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.topic_tag
    ADD CONSTRAINT topic_tag_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_activity_type_fkey FOREIGN KEY (activity_type) REFERENCES public.enum_user_activity(user_activity) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.question(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topic(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_course
    ADD CONSTRAINT user_course_user_course_fkey FOREIGN KEY (user_course) REFERENCES public.enum_user_course(user_course) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_course
    ADD CONSTRAINT user_course_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_status_fkey FOREIGN KEY (status) REFERENCES public.enum_user_status(user_status) ON UPDATE RESTRICT ON DELETE RESTRICT;
