"use client";
import { Button, Card } from 'react-bootstrap';

import { useEffect, useState } from 'react';
export default function DogCard({id, name, age, breed, image, zip_code, city, county, state, matchToggle}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  },[]);

  useEffect(() => {
    if(typeof window === 'undefined') return;

    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(storedFavorites.some((dog) => dog.id === id));
    
  }, [id, isClient]);

  // Function to add/remove favorites
  const toggleFavorite = () => {
    if(typeof window === 'undefined') return;

    if(typeof window !== 'undefined') {
      let storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (isFavorite) {
        // Remove from favorites
        storedFavorites = storedFavorites.filter((dog) => dog.id !== id);
      } else {
        // Add to favorites
        storedFavorites.push({ id, name, breed, image, zip_code, city, county, state });
      }
  
      // Update localStorage and state
      localStorage.setItem("favorites", JSON.stringify(storedFavorites));
      setIsFavorite(!isFavorite);
    }

  };
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={image} className="dog-card-image" />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          <strong>Age:</strong> {age}
          <br/>
          <strong>Breed:</strong> {breed}
          <br/>
          <strong>Located:</strong> {city}, {state}
          <br/>
          <strong>Zip Code:</strong> {zip_code}
          <br/>
          <strong>County:</strong> {county}
        </Card.Text>
        {matchToggle ?         
          '' : 
          <Button variant={isFavorite ? "danger" : "primary"} onClick={toggleFavorite}>
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button> 
        }
      </Card.Body>
    </Card>
  );
}