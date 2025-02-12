"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  FormCheck,
  Pagination,
  Row
} from "react-bootstrap";

import DogCard from "@/app/components/Card";
import NavigationBar from "../components/NavigationBar";

export default function Homepage() {
  const [NAME, setNAME] = useState('');
  useEffect(() => {
    setNAME(window.localStorage.getItem("name")); // Get name from local storage
  }, [])
  const URL = "https://frontend-take-home-service.fetch.com";
  const router = useRouter();

  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);

  // filtering
  const [selectedBreed, setSelectedBreed] = useState("Select a breed"); // User selected breeds
  const [zipCodes, setZipCodes] = useState([]);
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [size, setSize] = useState(12); // Breeds per page
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
    if (window.localStorage.getItem("name")) {
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
        window.localStorage.removeItem("name"); // Remove name from local storage
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
<Container className="homepage-container">
  <NavigationBar />
  
    {/* Greeting Message (Hello {NAME}) */}
    <Row style={{ marginBottom: "20px" }}>
      <Col>
        {NAME === "" || NAME === null ? (
          <h1>
            You've been logged out already, please press the logout button.
          </h1>
        ) : (
          <h1>Hello {NAME}!</h1>
        )}
      </Col>
    </Row>

    {/* Filtering and Page Info (Centered) */}
    <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
        <Col xs={10} sm={8} md={6} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Breed Selection Dropdown */}
          {/* <DropdownButton title={selectedBreed} className="custom-dropdown">
            {breeds.map((breed) => (
              <Dropdown.Item key={breed} as="div" onClick={() => handleBreedChange(breed)}>
                {breed}
              </Dropdown.Item>
            ))}
          </DropdownButton> */}
          <Dropdown>
            <Dropdown.Toggle
              variant="light"  // Use 'light' so that we can override with custom styles
              id="dropdown-breeds"
              className="custom-dropdown"
            >
              {selectedBreed}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {breeds.map((breed) => (
                <Dropdown.Item
                  key={breed}
                  as="div"
                  onClick={() => handleBreedChange(breed)}
                >
                  {breed}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {/* Page # of total Pages */}
          <span style={{ fontSize: "20px", padding: "0 15px" }}>
            Page {currentPage} of {totalPages}
          </span>
          
          {/* Sorting Dropdown */}
          {/* <DropdownButton
            id="dropdown-sort"
            title={sort === "breed:asc" ? "Breed (A-Z)" : "Breed (Z-A)"}
            style={{ width: "auto", backgroundColor: "#F8A619", borderColor: "#F8A619", color: "white"}}
          >
            <Dropdown.Item onClick={() => setSort("breed:asc")}>
              Breed (A-Z)
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSort("breed:desc")}>
              Breed (Z-A)
            </Dropdown.Item>
          </DropdownButton> */}
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-sort"
              title={sort === "breed:asc" ? "Breed (A-Z)" : "Breed (Z-A)"}
              style={{
                width: "auto",
                backgroundColor: "#F8A619",
                borderColor: "#F8A619",
                color: "white",
              }}
            >
              {sort === "breed:asc" ? "Breed (A-Z)" : "Breed (Z-A)"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSort("breed:asc")}>
                Breed (A-Z)
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSort("breed:desc")}>
                Breed (Z-A)
              </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </Col>
      </Row>
    {/* Display Results */}
    <Row style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
      {dogs.map((dog) => (
        <Col xs={12} sm={6} md={4} key={dog.id}>
          <DogCard
            id={dog.id}
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

    {/* Pagination Controls */}
    <Row>
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev onClick={() => goToPage(currentPage - 1, "prev")} disabled={currentPage === 1}>
          Prev
        </Pagination.Prev>
        <Pagination.Item active >{currentPage}</Pagination.Item>
        <Pagination.Next onClick={() => goToPage(currentPage + 1, "next")} disabled={currentPage === totalPages}>
          Next
        </Pagination.Next>
      </Pagination>
    </Row>
  </Container>

  );
}
