"use client";
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { name, email };

    try {
      // Sending the POST request
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      } else {
        console.log("successfully logged in")
      }

      // On successful login, handle the response
      // window.location.href = '/homepage'; // Redirect after successful login
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  };
/*
Cookie warnings 8
Cookie “AWSALB” does not have a proper “SameSite” attribute value. Soon, cookies without the “SameSite” attribute or with an invalid value will be treated as “Lax”. This means that the cookie will no longer be sent in third-party contexts. If your application depends on this cookie being available in such contexts, please add the “SameSite=None“ attribute to it. To know more about the “SameSite“ attribute, read https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite login
Cookie “AWSALB” will soon be rejected because it is foreign and does not have the “Partitioned“ attribute. login
Cookie “AWSALBCORS” will soon be rejected because it is foreign and does not have the “Partitioned“ attribute. login
Cookie “fetch-access-token” will soon be rejected because it is foreign and does not have the “Partitioned“ attribute. login
Cookie “AWSALB” does not have a proper “SameSite” attribute value. Soon, cookies without the “SameSite” attribute or with an invalid value will be treated as “Lax”. This means that the cookie will no longer be sent in third-party contexts. If your application depends on this cookie being available in such contexts, please add the “SameSite=None“ attribute to it. To know more about the “SameSite“ attribute, read https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite login
Cookie “AWSALB” will soon be rejected because it is foreign and does not have the “Partitioned“ attribute. login
Cookie “AWSALBCORS” will soon be rejected because it is foreign and does not have the “Partitioned“ attribute. login
Cookie “fetch-access-token” will soon be rejected because it is foreign and does not have the “Partitioned“ attribute.
*/

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control 
          type="email" 
          placeholder="Enter email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      {/*Potentially need it for later if we will need a password to login with*/}
      {/* <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Form>

    </Container>
  );
}
