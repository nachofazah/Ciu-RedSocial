import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";

const Home = () => {
  return (
    <Container fluid className="mt-0">
      <Row>
        {/* Izquierda: inicio y perfil */}
        <Col md={3} className="bg-light border-end vh-100 overflow-auto">
          <div className="pt-3 p-3">
            <button className="btn btn-outline-primary w-100 mb-2 text-start">
              🏠 Inicio
            </button>
            <button className="btn btn-outline-secondary w-100 mb-2 text-start">
              👤 Perfil
            </button>
            <button className="btn btn-outline-secondary w-100 mb-2 text-start">
              👤 Amigos
            </button>
          </div>
        </Col>

        {/* Centro: publicaciones */}
        <Col md={6} className="vh-100 overflow-auto">
          <div className="pt-3 p-3">
            <h5>¿Que queres compartir?</h5>
            <Button variant="primary" type="submit" className="w-100">
              Crear nueva publicación
            </Button>
          </div>
          <div className="p-3">
            <h4>Publicaciones de amigos</h4>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <Card key={n} className="mb-3">
                <Card.Body>
                  <Card.Title>Publicación #{n}</Card.Title>
                  <Card.Text>
                    Este es un ejemplo de contenido. Podés reemplazarlo con tus datos.
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>

        {/* Derecha: usuarios */}
        <Col md={3} className="bg-light border-start vh-100 overflow-auto">
          <div className="pt-3 p-3">
            <h5>Actividad reciente</h5>
            <ListGroup className="mb-3">
              {[
                "Juan comentó en tu publicación",
                "María subió una foto",
                "Pedro le dio like a tu publicación",
                "Luis comenzó a seguirte",
              ].map((act, idx) => (
                <ListGroup.Item key={idx}>{act}</ListGroup.Item>
              ))}
            </ListGroup>
            <ListGroup className="mb-3">
            </ListGroup>

            <h5>Otros usuarios</h5>
            <ListGroup>
              {["Ana", "Luis", "Carla"].map((user, idx) => (
                <ListGroup.Item key={idx}>{user}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;