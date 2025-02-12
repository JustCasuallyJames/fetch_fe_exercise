'use client';
import { useState, useEffect } from "react";
import DogCard from "@/app/components/Card";
import NavigationBar from '@/app/components/NavigationBar';
import "bootstrap/dist/css/bootstrap.min.css";

import { Row, Col, Button, Container } from 'react-bootstrap';
export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [favoriteDog, setFavoriteDog] = useState({});
  const [matchToggle, setMatchToggle] = useState(false);
  // Load favorites from localStorage when the page loads
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const findMatch = async() => {
    const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(favorites),
      credentials: 'include',
    });

    const data = await response.json();
    setFavoriteDog(data.match);
    // console.log("data", data.match);
  }

  return (
    <div style={{ padding: "20px" }}>
      <NavigationBar />
      <h1 style={{ textAlign: "center" }}>Favorites</h1>

      {favorites.length === 0 ? (
        <p style={{ textAlign: "center" }}>No favorites added.</p>
      ) : null}

      <Container>
        <Row
          className="justify-content-center"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          {favorites.map((dog) => (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={dog.id}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <DogCard {...dog} />
            </Col>
          ))}
        </Row>
      </Container>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button onClick={findMatch}>Find a match</Button>
      </div>

      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Match</h1>

      {JSON.stringify(favoriteDog) !== '{}' && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#F8A619", // Light gray background
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        >
          <DogCard {...favoriteDog} matchToggle={true}/>
        </div>
      )}
    </div>

  );
};
