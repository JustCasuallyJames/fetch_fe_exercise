"use client";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
export default function Homepage() {
    const NAME = localStorage.getItem('name'); // Get name from local storage
    const router = useRouter();
    const handleLogout = async () => {
        if (localStorage.getItem('name')){ // if there is a name to be removed
            const response = await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            // Call the api endpoint to log out to invalidate auth cookie
            if (!response.ok) { 
                throw new Error('Failed to logout'); 
            } else {
                console.log('Logged out successfully');
            }
            localStorage.removeItem('name'); // Remove name from local storage
        }  
        // since there is no name to be removed, just redirect.  
        router.push('/'); // redirect to login page
    }
    return(
        <Container>
            {NAME === '' || NAME === null ? 
            <h1>You've been logged out already, please press the logout button.</h1> 
            : <h1>Hello {NAME}!</h1>}
            <Button onClick={handleLogout}> Logout </Button>
        </Container>
    );
}