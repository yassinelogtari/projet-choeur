import React, { useState } from 'react';
import axios from 'axios';
import { Transition } from 'react-transition-group';
import confirm from "../../img/confirm.png"
import { FcPrevious } from 'react-icons/fc';

function EmailVerification() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailValidated, setEmailValidated] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setSuccessMessage('');
      setEmailValidated(false);
      return;
    }

    // Backend verification
    try {
      const response = await axios.post('http://localhost:8000/api/candidats/verif', { email });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setEmailValidated(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(error.response.data.message);
        setSuccessMessage('');
        setEmailValidated(false);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
        setSuccessMessage('');
        setEmailValidated(false);
      }
    }
  };

  const formStyles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    },
    formContainer: {
      textAlign: 'center',
      backgroundColor: '#fff',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    error: {
      color: 'red',
      marginTop: '10px',
    }
  };

  const successStyles = {
    container: {
      textAlign: 'center',
      opacity: 0,
      transition: 'opacity 0.5s ease-in-out',
    },
    successContainer: {
      opacity: 1,
    },
    message: {
      backgroundColor: '#6DDBD3',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      marginTop: '20px',
    },
    image: {
      maxWidth: '50%',
      height: 'auto',
    }
  };

  return (
    <>
    <div style={formStyles.container}>
      <div style={{ ...formStyles.formContainer, display: emailValidated ? 'none' : 'block' }}>
        <h2>Email Verification</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            style={formStyles.input}
          />
          <button type="submit" style={formStyles.button}>Verify Email</button>
        </form>
        {errorMessage && <p style={formStyles.error}>{errorMessage}</p>}
      </div>
      </div>
      <Transition in={emailValidated} timeout={500}>
      {state => (
          <div>

            <a href="/candidatsForm"><FcPrevious style={{ width: '30px', cursor: "pointer" }} /></a>

            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: state === 'exited' ? 0 : 1,
              transition: 'opacity 0.5s ease-in-out',
              textAlign: 'center',
            }}>
              {successMessage && (

                <>

                  <img src={confirm}
                    style={{ maxWidth: '60%', height: 'auto', display: 'block', margin: '0 auto' }} />
                  <div style={{
                    backgroundColor: '#6DDBD3',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '25px',
                    marginTop: '20px',
                  }}>
                    <p style={{ fontSize: "20px" }}>
                      {`We have sent you an email verification to your email `}
                      <a href={`https://mail.google.com/mail/u/0/#inbox`} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>{email}</a>
                      {`. Please check it and grab the link there.`}
                    </p>
                  </div>

                </>

              )}
            </div>

          </div>

        )}
      </Transition>
    
    </>
  );
}

export default EmailVerification;
