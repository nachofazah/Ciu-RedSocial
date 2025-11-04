import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Login(){
    return (    
    <>
    <h1>Iniciar sesión</h1>
      <Form.Label htmlFor="inputNickname5">Nickname</Form.Label>
      <Form.Control
        type="Nickname"
        id="inputNickname5"
      />
      <Form.Label htmlFor="inputPassword5">Password</Form.Label>
      <Form.Control
        type="password"
        id="inputPassword5"
      />
      <Button variant="secondary" size="lg">
        Confirmar
      </Button>
    </>
  );

}