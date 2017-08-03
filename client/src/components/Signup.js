import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Redirect } from 'react-router';


const renderField = ({type, label, input, meta: {touched, error} }) => (
  <div className="input-row">
    <label>{label}</label>
    <input {...input} type={type}/>
    {touched && error && <span className="error">{error}</span>}
  </div>
)

class SignupForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      redirect: false
    }

    this.submitSignup = this.submitSignup.bind(this);
    this.submit = this.submit.bind(this);
  }


  submitSignup(email, password) {
    return fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({email:email,password:password}),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
  }

  submit(values) {

    let error = {};
    let isError = false;

    if (!values.email) {
      error.email = 'Required';
      isError = true;
    }

    if (!values.password) {
      error.password = 'Required';
      isError = true;
    }

    if (isError) {
      throw new SubmissionError(error);
    } else {
      //submit form to server
      this.submitSignup(values.email, values.password)
        .then(data => console.log(data))
        .then(() => this.setState({ redirect: true }));
      // console.log(values);
    }

  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to='/app' />
    }

    return (
      <form onSubmit={ this.props.handleSubmit(this.submit) }>
          <Field name="email" label="Email" component={renderField} type="text" />
          <Field name="password" label="Password" component={renderField} type="password" />
          <button type="submit">Submit</button>
      </form>
    )
  }
}


SignupForm = reduxForm({
  form: 'SignupForm'
})(SignupForm)

export default SignupForm;


