import React from 'react'
import { Formik, FieldArray } from 'formik'
import { Button, Form, Input, FormGroup, Label } from 'reactstrap'

const Tags = (values, handleChange) => {
  return (
    <FieldArray
      name='tags'
      render={arrayHelpers => (
        <div>
          <Button
            type='button'
            onClick={() => arrayHelpers.push('')}
          >
            Add A Tag
          </Button>
          {values.tags && values.tags.length > 0 ? (
            values.tags.map((tag, index) => (
              <div key={index}>
                <FormGroup>
                  <Input
                    type='text'
                    id={`tags.${index}`}
                    name={`tags.${index}`}
                    value={values.tags.index}
                    onChange={handleChange}
                  />
                  <Button
                    type='button'
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    x
                  </Button>
                </FormGroup>
              </div>
            ))
          ) : (
            <p>No Tags entered</p>
          )}
        </div>
      )}
    />
  )
}

const Choices = (values, handleChange) => {
  return (
    <FieldArray
      name='choices'
      render={arrayHelpers => (
        <div>
          <Button
            type='button'
            onClick={() => arrayHelpers.push('')} // adds another input field
          >
            Add Choice
          </Button>
          {values.choices && values.choices.length > 0 ? (
            values.choices.map((question, index) => (
              <div key={index}>
                <FormGroup check>
                  <Label check>
                    <Input
                      type='checkbox'
                      id={`checked`}
                      name={`checked`}
                      value={values.checked} // jeth need ko tabang di
                      onChange={handleChange}
                    />
                    <Input
                      type='text'
                      id={`choices.${index}`}
                      name={`choices.${index}`}
                      value={values.choices.index}
                      onChange={handleChange}
                    />
                  </Label>
                  <Button
                    type='button'
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    x
                  </Button>
                </FormGroup>
              </div>
            ))
          ) : (
            <p>No Choices added yet</p>
          )}
        </div>
      )}
    />
  )
}
const AddQuestions = () => {
  return (
    <Formik
      initialValues={{
        question: '',
        choices: [],
        correctAnswers: [],
        wrongAnswers: [],
        tags: [],
        checked: ''
      }}
      render={({ values, handleChange }) => {
        return (
          <Form>
            Question
            <Input
              type='text'
              id={`question`}
              name={`question`}
              value={values.question}
              onChange={handleChange}
            />
            {Choices(values, handleChange)}
            {Tags(values, handleChange)}
            <Button type='submit'>Submit</Button>
          </Form>
        )
      }}
    />
  )
}

export default AddQuestions
