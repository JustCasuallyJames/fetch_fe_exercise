import { Card } from 'react-bootstrap';

export default function DogCard({name, age, breed, image, zip_code, city, county, state}) {
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
      </Card.Body>
    </Card>
  );
}