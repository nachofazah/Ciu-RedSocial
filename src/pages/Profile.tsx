import {Card, Container, Navbar, Button, Image, Row, Col} from 'react-bootstrap';
import type { ProfilePost } from '../types/ProfilePost';
import { useEffect, useState } from 'react';


const Profile = () => {
  
  const [posts, setPosts] = useState<ProfilePost[]>([])
  const [commentsNum, setCommentsNum] = useState<{ [key: number]: number }>({});
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {  
    fetch("http://localhost:3001/posts?userId=1").then((res) => {
      if(!res.ok) throw new Error("No se pudieron recuperar las publicaciones.")
      return res.json()
    }).then((data) => setPosts(data))
    .catch((e: any) => setError(e.mensaje()))
  }, []);

  useEffect(() => {
    posts.forEach(post => {
      fetch(`http://localhost:3001/comments/post/${post.id}`)
        .then(res => res.json())
        .then(data => {
          setCommentsNum(prev => ({ ...prev, [post.id]: data.length }));
        })
        .catch(err => console.error("Se produjo un error al cargar los comentarios", err));
      });
        }, [posts]);
      

  if (error) return <p>Error: {error}</p>
  


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
          <Button variant="outline-success"/*onClick={ clear()}*/>Cerrar sesión</Button>
        </Container>
      </Navbar>

      <Container className="mb-3 w-50 d-block mx-auto">
        <Row>
          <Col xs={6} md={4}>
            <Image src="/pfp.jpg" id="pfp" roundedCircle fluid />
            <h4>NickName</h4>
          </Col>
        </Row>
      </Container>
    <Col>
    
      {posts.length === 0 ? (
        <h6>Aún no se han realizado publicaciones</h6>)
         : [...posts].map((post) =>
        <Card key={post.id} className="mb-3 w-50 d-block mx-auto">
         <Card.Body>
            <Card.Text>{post.description}</Card.Text>

          <h6>{commentsNum[post.id] ?? 0} 🗨️</h6>

          <Button /*href="post/id"*/ >
            Ver más 👁️
          </Button>
         </Card.Body>
         </Card>
         )}
    </Col>
    </>
  );
}

export default Profile;
