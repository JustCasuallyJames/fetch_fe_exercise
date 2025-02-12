"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Container, Form } from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Run only on client side after initial render
  useEffect(() => {
    setIsClient(true);
  }, []);

  const router = useRouter();

  const handleSubmit = async (e) => {
    // Ensure this logic runs on the client side only
    if (isClient && typeof window !== 'undefined') {
      e.preventDefault();

      const data = { name, email };
  
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Failed to submit the form');
        }
  
        // Save the name in localStorage only on the client side
        if (typeof window.localStorage !== 'undefined') {
          localStorage.setItem('name', name);
        }
  
        router.push('/home'); // Redirect after login
      } catch (error) {
        setError('Login failed. Please try again.');
        console.error('Error during login:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
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

          <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </div>
    </Container>
  );
}
