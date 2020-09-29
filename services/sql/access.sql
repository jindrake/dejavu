begin;

create role dejavu_admin login password 'test';

create role dejavu_anonymous;

create role dejavu_user;

grant dejavu_anonymous to dejavu_admin;

grant dejavu_user to dejavu_admin;

grant usage on schema public to dejavu_anonymous, dejavu_user;

grant select on table public.enum_field to dejavu_anonymous, dejavu_user; 

grant insert, select on table public.user_field to dejavu_anonymous;

grant insert, select on table public.user_field to dejavu_user;

grant select on table public.user to dejavu_user;

grant select on table public.topic to dejavu_user, dejavu_anonymous;

grant insert, update, delete on table public.topic to dejavu_user;

grant select on table public.topic_rating to dejavu_user, dejavu_anonymous;

grant insert, update, delete on table public.topic_rating to dejavu_user;

grant insert, select on table public.topic_field to dejavu_user;

grant select on table public.topic_field to dejavu_anonymous;

grant insert, select, delete on table public.question_topic to dejavu_user;

grant insert, select, update, delete on table public.answer to dejavu_user;

grant insert, select, update on table public.question to dejavu_user;

alter table public.user enable row level security;
alter table public.topic enable row level security;

alter table public.question_topic enable row level security;

create policy select_user on public.user for select to dejavu_user 
  using(id = current_setting('jwt.claims.user_id', true)::uuid);

create policy update_user on public.user for update to dejavu_user 
  using(id = current_setting('jwt.claims.user_id', true)::uuid);

create policy select_topic on public.topic for select using (true);

create policy insert_topic on public.topic for insert to dejavu_user
  with check (creator_id = current_setting('jwt.claims.user_id', true)::uuid);

create policy update_topic on public.topic for update to dejavu_user
  using (creator_id = current_setting('jwt.claims.user_id', true)::uuid);

create policy select_question_topic on public.question_topic for select to dejavu_user
  using (true);

create policy insert_question_topic on public.question_topic for insert to dejavu_user
  with check (public.is_topic_admin(topic_id, current_setting('jwt.claims.user_id', true)::uuid));

create policy delete_question_topic on public.question_topic for delete to dejavu_user
  using (public.is_topic_admin(topic_id, current_setting('jwt.claims.user_id', true)::uuid));

grant execute on function public.create_firebase_user(text, text, text, text, text, text, boolean) to dejavu_anonymous;

grant execute on function public.create_question_answers(public.answer_input[], UUID) to dejavu_user;

grant execute on function public.is_topic_admin(UUID, UUID) to dejavu_user;

commit;
