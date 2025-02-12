import { Button, Container, Nav, Navbar } from 'react-bootstrap';

import { useRouter } from "next/navigation";
export default function NavigationBar() {
  const URL = "https://frontend-take-home-service.fetch.com";
  const router = useRouter();
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


  return (
    <Navbar expand="lg" className="">
      <Container className="navbar-container">
        {/* <Navbar.Brand href="/home" className="fw-bold">Dog Finder</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100 d-flex">
            <Nav.Link href="/home" className="navbar-links">Home</Nav.Link>
            <Nav.Link href="/favorites" className="navbar-links ms-auto">Favorites</Nav.Link>
            <Button onClick={handleLogout} className="custom-dropdown">Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

