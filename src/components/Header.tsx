import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container fluid className="px-3">
                <Navbar.Brand href="/">Logo</Navbar.Brand>
                <Nav>
                    <Nav.Link href="/">Iniciar Sesión</Nav.Link>
                    <Nav.Link href="/">Registrarse</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;