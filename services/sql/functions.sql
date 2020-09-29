BEGIN;

alter default privileges revoke execute on functions from public;

create or replace function public.create_firebase_user(
  userId text,
  fieldId text,
  email text,
  firstName text,
  lastName text,
  field text,
  hasFinished boolean
) returns public.user as $$
  DECLARE
    person public.user;
  BEGIN
    INSERT INTO public.user (id, email, first_name, last_name) 
    VALUES (userId::uuid, email, firstName, lastName) returning * into person;

    INSERT INTO public.user_field (id, user_id, field, has_finished)
    VALUES (fieldId::uuid, person.id, field, hasFinished);

    RETURN person;
  END;
$$ language plpgsql strict security definer;

comment on function public.create_firebase_user(text, text, text, text, text, text, boolean) is 'Creates a user and field value for firebase user account';

create type public.answer_input as (
  answer text,
  is_correct boolean,
  id UUID
);

create or replace function public.create_question_answers(
  answers public.answer_input[],
  question_id UUID
) returns boolean as $$
  begin
    if exists (select 1 from public.question where question.id = $2)
    then
      insert into public.answer(answer, id, question_id, is_correct)
      select answer, id, $2, is_correct
      from unnest($1);
      return true;
    else
      return false;
    end if;
  end;
$$ language plpgsql strict;
  
create or replace function public.is_topic_admin (topic_id UUID, user_id UUID)
returns boolean as $$
  begin
    return exists (select 1 from public.topic where topic.id = $1 and topic.creator_id = $2);
  end;
$$ language plpgsql strict stable;

COMMIT;