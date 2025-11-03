import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import type { Post } from "../types/Post";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
      // Traemos las publicaciones desde el backend
      fetch("http://localhost:3001/posts") // ajustá la URL si tu backend usa otro puerto
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch((err) => console.error("Error al cargar posts:", err));
    }, []);
    
  return (
    <Container fluid className="mt-0">
      <Row>
        {/* Izquierda: inicio y perfil */}
        <Col md={3} className="bg-light border-end vh-100 overflow-auto">
          <div className="d-flex flex-column gap-2 pt-3 p-3">
            <Button variant="secondary" size="lg" className="w-100 text-start">
              🏠 Inicio
            </Button>

            <Button variant="secondary" size="lg" className="w-100 text-start">
              👤 Perfil
            </Button>

            <Button variant="secondary" size="lg" className="w-100 text-start">
              👥 Amigos
            </Button>
          </div>
        </Col>

        {/* Centro: publicaciones */}
        <Col md={6} className="vh-100 overflow-auto">
          <div className="p-3">
            <h5>¿Qué querés compartir?</h5>
            <Button variant="primary" className="w-100 mb-3">
              Crear nueva publicación
            </Button>
          </div>

          <div className="p-3">
            <h4>Publicaciones de amigos</h4>
            {posts.length === 0 ? (
              <p>No hay publicaciones todavía.</p>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="mb-3">
                  <Card.Body>
                    <Card.Title>Post #{post.id}</Card.Title>
                    <Card.Text>{post.description}</Card.Text>
                    {/* Podés mapear imágenes, tags, cantidad de comentarios */}
                    {post.images &&
                      post.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Post"
                          className="img-fluid mb-2"
                        />
                      ))}
                    {post.tags && (
                      <div>
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="badge bg-secondary me-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {post.commentsCount !== undefined && (
                      <p>{post.commentsCount} comentarios</p>
                    )}
                  </Card.Body>
                </Card>
              ))
            )}
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