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

COMMIT;