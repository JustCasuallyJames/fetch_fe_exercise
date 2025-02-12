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
  Pagination
} from "react-bootstrap";
import { useRouter } from "next/navigation";

import DogCard from "@/app/components/Card";

export default function Homepage() {
  const NAME = localStorage.getItem("name"); // Get name from local storage
  const URL = "https://frontend-take-home-service.fetch.com";
  const router = useRouter();

  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);

  // filtering
  const [selectedBreed, setSelectedBreed] = useState("Select a breed"); // User selected breeds
  const [zipCodes, setZipCodes] = useState([]);
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [size, setSize] = useState(9); // Breeds per page
  const [sort, setSort] = useState("breed:asc"); // breed:asc | breed:desc or name:asc | name:desc or age:asc | age:desc

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [next, setNext] = useState("");
  const [prev, setPrev] = useState("");
  const [totalSize, setTotalSize] = useState(10000);
  const totalPages = Math.ceil(totalSize / size);

  const [locations, setLocations] = useState({});
  // Get breeds for the current page
  // const indexOfLastBreed = currentPage * size;
  // const indexOfFirstBreed = indexOfLastBreed - size;
  // const currentBreeds = breeds.slice(indexOfFirstBreed, indexOfLastBreed);

  // Handle page changes
  const goToPage = async (page, toggle="") => {
    console.log("entered into PAGE filter useEffect")
    if (page >= 1 && page <= totalPages) {
      console.log("totalPages", totalPages)
      setCurrentPage(page);
      let fetchURL = `${URL}`
      if(toggle === 'next') fetchURL += next;
      else if (toggle === 'prev') fetchURL += prev;

      const response = await fetch(`${fetchURL}`, {
        // response to get dog search results
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if(data.prev) setPrev(data.prev);
      setNext(data.next);
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
    }
  };

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
    setSelectedBreed(data);
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
      data.unshift("All Breeds");
      setBreeds(data);
    };
    fetchBreeds();
  }, []);
  
  // Fetch dogs based on filters
  useEffect(() => {
    const fetchDogs = async () => {
      const params = new URLSearchParams();
      //filters
      if (selectedBreed != 'Select a breed' && selectedBreed != 'All Breeds') params.append("breeds", selectedBreed);
      // else if (selectedBreed === 'All Breeds') breeds.forEach((breed) => params.append("breeds", breed));
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
      if(data.prev) setPrev(data.prev);
      setNext(data.next);
      setTotalSize(data.total);
      setCurrentPage(1); // reset the current page count when you change the breed filter
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
  }, [selectedBreed, zipCodes, ageMin, ageMax, size, sort]); // Runs when filters change

  const fetchDogLocations = async (dogZipcodes) => {
    if (!dogZipcodes || dogZipcodes.length === 0) return;

    const response = await fetch(`${URL}/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dogZipcodes),
      credentials: "include",
    })
    const resData = await response.json();
    const locationDictionary = resData.reduce((acc, location) => {
      acc[location.zip_code] = location;
      return acc;
    }, {});
    setLocations(locationDictionary);
  }

  useEffect(() => {
    if (dogs.length > 0) {
      const dogZipcodes = [...new Set(dogs.map(dog => dog.zip_code))]; // Unique zip codes only
      fetchDogLocations(dogZipcodes);
    }
  }, [dogs]); 
  
  return (
    <Container>
      {/* Breed Selection */}
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
      <Row>
        <Col>
          <DropdownButton variant="secondary" id="dropdown-breeds" title={selectedBreed}>
            {breeds.map((breed) => (
              <Dropdown.Item
                key={breed}
                as="div"
                onClick={() => handleBreedChange(breed)}
              >
                {breed}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
        <Col>
        Page {currentPage} of {totalPages}
        </Col>
        {/* Sorting */}
        <Col>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="breed:asc">Breed (A-Z)</option>
            <option value="breed:desc">Breed (Z-A)</option>
            {/* <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="age:asc">Age (Youngest First)</option>
            <option value="age:desc">Age (Oldest First)</option> */}
          </select>
        </Col>
      </Row>

      {/* Zip Code Input */}
      {/* <label>Zip Code:</label>
      <input
        type="text"
        value={zipCodes}
        onChange={(e) => setZipCodes(e.target.value)}
      /> */}

      {/* Age Min/Max */}
      {/* <label>Age Range:</label>
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
      /> */}

      {/* Page Size */}
      {/* <label>Results per Page:</label>
      <input
        type="number"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      /> */}

      {/* Display Results */}
      {/* <h3>Search Results:</h3> */}
      <Row>
        {dogs.map((dog) => (
          <Col xs={12} sm={6} md={4} key={dog.id}>
            {/* {console.log("locations:",locations)} */}
            <DogCard
              name={dog.name}
              age={dog.age}
              breed={dog.breed}
              image={dog.img}
              zip_code={dog.zip_code}
              city={locations[dog.zip_code] ? locations[dog.zip_code].city : "Unknown"}
              county={locations[dog.zip_code] ? locations[dog.zip_code].county : "Unknown"}
              state={locations[dog.zip_code] ? locations[dog.zip_code].state : "Unknown"}
              />
          </Col>
        ))}
      </Row>
      <Row>
        {/* Pagination Controls */}
        <Pagination className="justify-content-center mt-3">
          {/* <Pagination.First onClick={() => goToPage(1)} disabled={currentPage === 1}>First</Pagination.First> */}
          <Pagination.Prev onClick={() => goToPage(currentPage - 1, "prev")} disabled={currentPage === 1}>Prev</Pagination.Prev>
          <Pagination.Item active>{currentPage}</Pagination.Item>
          <Pagination.Next onClick={() => goToPage(currentPage + 1, "next")} disabled={currentPage === totalPages}>Next</Pagination.Next>
          {/* <Pagination.Last onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>Last</Pagination.Last> */}
        </Pagination>
      </Row>

    </Container>
  );
}
