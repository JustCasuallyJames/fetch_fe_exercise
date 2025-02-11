"use client";
import { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Button,
  Container,
  Col,
  Row,
  Dropdown,
  DropdownButton,
  FormCheck,
} from "react-bootstrap";
import { useRouter } from "next/navigation";

import DogCard from "@/app/components/Card";

export default function Homepage() {
  const NAME = localStorage.getItem("name"); // Get name from local storage
  const URL = "https://frontend-take-home-service.fetch.com";

  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);

  // filtering
  const [selectedBreeds, setSelectedBreeds] = useState([]); // User selected breeds
  const [zipCodes, setZipCodes] = useState([]);
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [size, setSize] = useState(25);
  const [sort, setSort] = useState("breed:asc"); // breed:asc | breed:desc or name:asc | name:desc or age:asc | age:desc

  const router = useRouter();
  const handleLogout = async () => {
    if (localStorage.getItem("name")) {
      // if there is a name to be removed
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      // Call the api endpoint to log out to invalidate auth cookie
      if (response.status != 200) {
        console.log("Cannot log out");
      } else {
        console.log("Logged out successfully");
        localStorage.removeItem("name"); // Remove name from local storage
      }
    }
    // since there is no name to be removed, just redirect.
    router.push("/"); // redirect to login page
  };

  const handleBreedChange = (data) => {
    setSelectedBreeds((prev) =>
      prev.includes(data) ? prev.filter((b) => b !== data) : [...prev, data]
    );
  };

  useEffect(() => { //fetch the dog breeds
    const fetchBreeds = async () => {
      const response = await fetch(`${URL}/dogs/breeds`, {
        credentials: "include",
      });

      if (!response.ok) {
        // put a message to the user saying that they have to relog in because there is no valid cookie
      }
      const data = await response.json();
      setBreeds(data);
    };

    fetchBreeds();
  }, []);

  // Fetch dogs based on filters
  useEffect(() => {
    const fetchDogs = async () => {
      const params = new URLSearchParams();

      if (selectedBreeds.length > 0)
        selectedBreeds.forEach((breed) => params.append("breeds", breed)); // this puts repeated query parameters for breeds
      if (zipCodes > 0) params.append("zipCodes", zipCodes.join(","));
      if (ageMin) params.append("ageMin", ageMin);
      if (ageMax) params.append("ageMax", ageMax);
      params.append("size", size);
      params.append("sort", sort);

      const response = await fetch(`${URL}/dogs/search?${params.toString()}`, {
        // response to get dog search results
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      let dogIds = data.resultIds;

      const response1 = await fetch(`${URL}/dogs`, {
        // response to get the array of dogs
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogIds),
        credentials: "include",
      });
      const response1data = await response1.json();
      setDogs(response1data); // array of dog objects
    };

    fetchDogs();
  }, [selectedBreeds, zipCodes, ageMin, ageMax, size, sort]); // Runs when filters change

  return (
    <Container>
      <DropdownButton
        variant="secondary"
        id="dropdown-breeds"
        title="Select Breeds"
      >
        {breeds.map((breed) => (
          <Dropdown.Item
            key={breed}
            as="div"
            onClick={(e) => e.stopPropagation()}
          >
            <FormCheck
              type="checkbox"
              label={breed}
              checked={selectedBreeds.includes(breed)}
              onChange={() => handleBreedChange(breed)}
            />
          </Dropdown.Item>
        ))}
      </DropdownButton>
      {/* Breed Filter */}
      <label>Breed:</label>

      {/* Zip Code Input */}
      <label>Zip Code:</label>
      <input
        type="text"
        value={zipCodes}
        onChange={(e) => setZipCodes(e.target.value)}
      />

      {/* Age Min/Max */}
      <label>Age Range:</label>
      <input
        type="number"
        value={ageMin}
        onChange={(e) => setAgeMin(e.target.value)}
        placeholder="Min Age"
      />
      <input
        type="number"
        value={ageMax}
        onChange={(e) => setAgeMax(e.target.value)}
        placeholder="Max Age"
      />

      {/* Page Size */}
      <label>Results per Page:</label>
      <input
        type="number"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />

      {/* Sorting */}
      <label>Sort By:</label>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="breed:asc">Breed (A-Z)</option>
        <option value="breed:desc">Breed (Z-A)</option>
        <option value="name:asc">Name (A-Z)</option>
        <option value="name:desc">Name (Z-A)</option>
        <option value="age:asc">Age (Youngest First)</option>
        <option value="age:desc">Age (Oldest First)</option>
      </select>

      {/* Display Results */}
      <h3>Search Results:</h3>
      <Row>
        {dogs.map((dog) => (
          <Col xs={12} sm={6} md={4} key={dog.id}>
            <DogCard
              name={dog.name}
              age={dog.age}
              breed={dog.breed}
              image={dog.img}
              zip_code={dog.zip_code}
            />
          </Col>
        ))}
      </Row>
      {/* <Row>{breeds.join(", ")}</Row> */}
      <Row>
        <Col>
          {NAME === "" || NAME === null ? (
            <h1>
              You've been logged out already, please press the logout button.
            </h1>
          ) : (
            <h1>Hello {NAME}!</h1>
          )}
        </Col>
        <Col>
          <Button onClick={handleLogout}> Logout </Button>
        </Col>
      </Row>
    </Container>
  );
}
