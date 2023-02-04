import "./App.css";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [email, setEmail] = useState("");
  const [images, setImages] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();
  const CDNURL = `https://fllsdamdpttceokiezkf.supabase.co/storage/v1/object/public/images/`;

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  const magicLinkLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      alert(
        "Error communicating with supabase, make sure to use a real email address!"
      );
      console.log(error);
    } else {
      alert("Check your email for a Supabase Magic Link to log in!");
    }
  };

  const signout = async () => {
    const { error } = await supabase.auth.signOut();
  };

  const uploadImage = async (e) => {
    let file = e.target.files[0];
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`${user.id}/${uuidv4()}`, file);

    if (data) {
      getImages();
    } else {
      console.log(error);
    }
  };

  const getImages = async () => {
    const { data, error } = await supabase.storage
      .from("images")
      .list(`${user?.id}/`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null) {
      setImages(data);
    } else {
      alert("Error Loading Images");
      console.log(data.error);
    }
  };

  const deleteImage = async (imageName) => {
    const { error } = await supabase.storage
      .from("images")
      .remove(`${user.id}/${imageName}`);

    if (error) {
      alert(error);
    } else {
      getImages();
    }
  };

  return (
    <Container align="center" className="container-sm mt-4">
      {user === null ? (
        <>
          <h1>Welcome to your Image Gallery</h1>
          <Form>
            <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
              <Form.Label>Enter an email to sign in</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={magicLinkLogin} variant="primary">
                Get Magic Link
              </Button>
            </Form.Group>
          </Form>
        </>
      ) : (
        <>
          <h1>Your Image Gallery</h1>
          <Button onClick={signout}>Sign Out</Button>
          <p>Current User: {user.email}</p>
          <p>
            Use the Choose File button below to upload an image to your gallery
          </p>
          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
            <Form.Control
              type="file"
              accept="image/png, image/jpeg"
              onChange={uploadImage}
            />
          </Form.Group>
          <hr />
          <h3>Your Images</h3>
          <Row xs={1} md={3} className="g-4">
            {images.map((image) => {
              return (
                <Col key={CDNURL + user.id + "/" + image.name}>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={`${CDNURL}${user.id}/${image.name}`}
                    />
                    <Card.Body>
                      <Button
                        variant="danger"
                        onClick={() => deleteImage(image.name)}
                      >
                        Delete Image
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;
