import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import { useEffect, useState } from "react";
import type { Post } from "../types/Post";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsCount, setCommentsCount] = useState<{ [key: number]: number }>({});
  const [postImages, setPostImages] = useState<{ [key: number]: string[] }>({});

  useEffect(() => {
      // Traemos las publicaciones desde el backend
      fetch("http://localhost:3001/posts") // ajustá la URL si tu backend usa otro puerto
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch((err) => console.error("Error al cargar posts:", err));
    }, []);


  useEffect(() => {
    posts.forEach(post => {
      // Traer comentarios
      fetch(`http://localhost:3001/comments/post/${post.id}`)
        .then(res => res.json())
        .then(data => {
          setCommentsCount(prev => ({ ...prev, [post.id]: data.length }));
        })
        .catch(err => console.error("Error al cargar comentarios:", err));

      // Traer imágenes y guardar solo los URLs
      fetch(`http://localhost:3001/postimages/post/${post.id}`)
        .then(res => res.json())
        .then(data => {
          const urls = data.map((img: { url: string }) => img.url);
          setPostImages(prev => ({ ...prev, [post.id]: urls }));
        })
        .catch(err => console.error("Error al cargar imágenes:", err));
    });
  }, [posts]);

    
    
  return (
    <Container fluid className="mt-0">
      <Row>
        {/* Izquierda: inicio y perfil */}
        <Col md={3} className="bg-dark border-end vh-100 overflow-auto">
          <div className="d-flex flex-column gap-2 pt-3 p-3">
            <Nav.Link href="/">
              <Button variant="secondary" size="lg" className="bg-botones mb-2 w-50">
                🏠 Inicio
              </Button>
            </Nav.Link>

            <Nav.Link href="/">
              <Button variant="secondary" size="lg" className="bg-botones mb-2 w-50">
                👤 Perfil
              </Button>
            </Nav.Link>

            <Nav.Link href="/">
              <Button variant="secondary" size="lg" className="bg-botones mb-2 w-50">
                👥 Amigos
              </Button>
            </Nav.Link>

            <Button variant="secondary" size="lg" className="bg-botones mb-2 w-50">
              Modo Claro
            </Button>
          </div>
        </Col>

        {/* Centro: publicaciones */}
        <Col md={6} className="bg-dark vh-100 overflow-auto">
          <div className="p-3">
            <h4 className="text-center text-light mb-2">¿Qué querés compartir?</h4>
            <Button variant="primary" className="bg-botones w-100 mb-3">
              Crear nueva publicación
            </Button>
          </div>

          <div className="p-3">
            <h4 className="text-center text-light mb-2">Publicaciones de amigos</h4>
            {posts.length === 0 ? (
              <p>No hay publicaciones todavía.</p>
            ) : (
              [...posts]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((post) => (
                  <Card key={post.id} className="mb-3 bg-publicaciones text-light">
                  <Card.Body>
                    <Card.Text>{post.description}</Card.Text>

                    {/* Imágenes */}
                    {postImages[post.id]?.map((imgUrl, idx) => (
                      <img key={idx} src={imgUrl} alt={`Post ${post.id}`} className="img-fluid mb-2" />
                    ))}


                    {/* Tags */}
                    {post.Tags && post.Tags.length > 0 && (
                      <div className="mb-2">
                        <h5>Etiquetas:</h5>
                        {post.Tags.map((tag) => (
                          <span key={tag.id} className="badge bg-secondary me-1">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Cantidad de comentarios */}
                    <p>
                      {commentsCount[post.id] ?? 0} comentarios
                    </p>

                    {/* Botón Ver más */}
                    <Button
                      className="bg-botones"
                      size="sm"
                      href={`/post/${post.id}`} // ruta dinámica
                    >
                      Ver más
                    </Button>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>

        {/* Derecha: usuarios */}
        <Col md={3} className="bg-dark border-start vh-100 overflow-auto">
          <div className="pt-3 p-3">
            <h4 className="text-center mb-2">Actividad reciente</h4>
            <ListGroup className="mb-3">
              {[
                "Juan comentó en tu publicación",
                "María subió una foto",
                "Pedro le dio like a tu publicación",
                "Luis comenzó a seguirte",
              ].map((act, idx) => (
                <ListGroup.Item className="bg-publicaciones" key={idx}>{act}</ListGroup.Item>
              ))}
            </ListGroup>
            <ListGroup className="mb-3">
            </ListGroup>

            <h4 className="text-center mb-2">Otros usuarios</h4>
            <ListGroup className="bg-publicaciones">
              {["Ana", "Luis", "Carla"].map((user, idx) => (
                <ListGroup.Item  className="bg-publicaciones" key={idx}>{user}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;