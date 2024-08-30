"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faDownload, faSave } from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:8001/api'; // Ensure this matches your backend URL

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    location: '',
    gender: '',
    occupation: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/profile`);
      setProfile(response.data);
    } catch (error) {
      setError('Error fetching profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API_URL}/profile`, profile);
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError('Error saving profile');
      console.error('Error saving profile:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'profile.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Error downloading profile');
      console.error('Error downloading profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="mx-auto">
          <h2 className="mb-4">Profile</h2>
          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            {Object.entries(profile).map(([key, value]) => (
              <Form.Group key={key} className="mb-3">
                <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Form.Group>
            ))}
          </Form>
          <div className="mt-3">
            {isEditing ? (
              <Button variant="primary" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} /> Save
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleEdit}>
                <FontAwesomeIcon icon={faEdit} /> Edit
              </Button>
            )}
            <Button variant="success" onClick={handleDownload} className="ms-2">
              <FontAwesomeIcon icon={faDownload} /> Download PDF
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
