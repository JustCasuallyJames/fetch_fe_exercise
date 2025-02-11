import { Card } from 'react-bootstrap';

export default function DogCard({name, age, breed, image, zip_code}) {
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
          <strong>Zip Code:</strong> {zip_code}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}