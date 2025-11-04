import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function Home() {
    return (
    <>
    <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src="/antiSocial_Logo.png"
              width="40"
              height="40"
              className="d-inline-block align-top"
            />{' '}
            Anti-Social
          </Navbar.Brand>
          <Navbar.Brand href="/Profile">
            <img
              alt=""
              src="/profile.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />{' '}
          </Navbar.Brand>
        </Container>
      </Navbar>
    
    <Container style={{padding: "50 px", margin: "50px"}}>
        <Card style={{ width: '18rem'}}>
        <Card.Img variant="top" src="/antiSocial_Logo.png"/>
        <Card.Body>Bienvenido a Anti-social.</Card.Body>
        </Card>
    </Container>
    </>
  );

} 