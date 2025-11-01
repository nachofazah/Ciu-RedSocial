import { Container, Row, Col, Card, Form, Button, ListGroup } from "react-bootstrap";

const Home = () => {
  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Izquierda: nueva publicación */}
        <Col md={3} className="bg-light border-end vh-100 overflow-auto">
          <div className="p-3">
            <h5>Crear nueva publicación</h5>
            <Form>
              <Form.Group className="mb-3" controlId="titulo">
                <Form.Label>Título</Form.Label>
                <Form.Control type="text" placeholder="Escribí un título" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contenido">
                <Form.Label>Contenido</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="¿Qué querés compartir?" />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Publicar
              </Button>
            </Form>
          </div>
        </Col>

        {/* Centro: publicaciones */}
        <Col md={6} className="vh-100 overflow-auto">
          <div className="p-3">
            <h4>Publicaciones</h4>
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
          <div className="p-3">
            <h5>Amigos</h5>
            <ListGroup className="mb-3">
              {["Juan", "María", "Pedro"].map((user, idx) => (
                <ListGroup.Item key={idx}>{user}</ListGroup.Item>
              ))}
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