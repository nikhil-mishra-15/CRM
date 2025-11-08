// MongoDB client configuration for frontend
// This assumes you have a backend API endpoint that connects to MongoDB
// For direct MongoDB connection from frontend, consider using MongoDB Realm SDK

const API_BASE_URL = import.meta.env.VITE_MONGODB_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle authentication errors
const handleAuthError = (response) => {
  if (response.status === 401) {
    // Token expired or invalid - clear auth and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
};

// Contact schema/type (for reference)
export const ContactSchema = {
  id: String,
  name: String,
  phone: String,
  remark: String,
  status: ['future', 'rejected', 'lead'],
  created_at: String,
  updated_at: String,
};

// MongoDB API client functions
export const mongodb = {
  // Fetch all contacts
  async getContacts() {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        handleAuthError(response);
        throw new Error('Failed to fetch contacts');
      }
      const contacts = await response.json();
      // Convert MongoDB _id to id and normalize field names for frontend compatibility
      return contacts.map(contact => ({
        ...contact,
        id: contact._id || contact.id,
        // Normalize createdAt to created_at if needed
        created_at: contact.createdAt || contact.created_at,
        updated_at: contact.updatedAt || contact.updated_at,
        // Ensure status has a default value
        status: contact.status || 'future',
        remark: contact.remark || '',
        followUpDate: contact.followUpDate || null,
        called: contact.called || false
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Get a single contact by ID
  async getContact(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        handleAuthError(response);
        throw new Error('Failed to fetch contact');
      }
      const contact = await response.json();
      // Convert MongoDB _id to id and normalize field names for frontend compatibility
      return {
        ...contact,
        id: contact._id || contact.id,
        // Normalize createdAt to created_at if needed
        created_at: contact.createdAt || contact.created_at,
        updated_at: contact.updatedAt || contact.updated_at,
        // Ensure status has a default value
        status: contact.status || 'future',
        remark: contact.remark || '',
        followUpDate: contact.followUpDate || null
      };
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  },

  // Create a new contact
  async createContact(contact) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(contact),
      });
      if (!response.ok) {
        handleAuthError(response);
        const errorData = await response.json().catch(() => ({ message: 'Failed to create contact' }));
        throw new Error(errorData.message || 'Failed to create contact');
      }
      const newContact = await response.json();
      // Convert MongoDB _id to id and normalize field names for frontend compatibility
      return {
        ...newContact,
        id: newContact._id || newContact.id,
        created_at: newContact.createdAt || newContact.created_at,
        updated_at: newContact.updatedAt || newContact.updated_at,
        status: newContact.status || 'future',
        remark: newContact.remark || ''
      };
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  // Update an existing contact (full update using PUT)
  async updateContact(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        handleAuthError(response);
        const errorData = await response.json().catch(() => ({ message: 'Failed to update contact' }));
        throw new Error(errorData.message || 'Failed to update contact');
      }
      const updatedContact = await response.json();
      // Convert MongoDB _id to id and normalize field names for frontend compatibility
      return {
        ...updatedContact,
        id: updatedContact._id || updatedContact.id,
        created_at: updatedContact.createdAt || updatedContact.created_at,
        updated_at: updatedContact.updatedAt || updatedContact.updated_at,
        status: updatedContact.status || 'future',
        remark: updatedContact.remark || ''
      };
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  // Partial update (remark and status) using PATCH
  async patchContact(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        handleAuthError(response);
        const errorData = await response.json().catch(() => ({ message: 'Failed to update contact' }));
        throw new Error(errorData.message || 'Failed to update contact');
      }
      const updatedContact = await response.json();
      // Convert MongoDB _id to id and normalize field names for frontend compatibility
      return {
        ...updatedContact,
        id: updatedContact._id || updatedContact.id,
        created_at: updatedContact.createdAt || updatedContact.created_at,
        updated_at: updatedContact.updatedAt || updatedContact.updated_at,
        status: updatedContact.status || 'future',
        remark: updatedContact.remark || '',
        followUpDate: updatedContact.followUpDate || null,
        called: updatedContact.called || false
      };
    } catch (error) {
      console.error('Error patching contact:', error);
      throw error;
    }
  },

  // Delete a contact
  async deleteContact(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        handleAuthError(response);
        throw new Error('Failed to delete contact');
      }
      const result = await response.json();
      // Convert MongoDB _id to id for frontend compatibility if contact is returned
      if (result.contact) {
        result.contact = {
          ...result.contact,
          id: result.contact._id || result.contact.id
        };
      }
      return result;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  // Subscribe to real-time updates (using WebSocket or Server-Sent Events)
  // Note: This requires backend support for real-time updates
  subscribeToContacts(callback) {
    // Implementation depends on your backend setup
    // This could use WebSocket, Server-Sent Events, or polling
    const eventSource = new EventSource(`${API_BASE_URL}/contacts/stream`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    eventSource.onerror = (error) => {
      console.error('Error in contact stream:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  },
};

// For direct MongoDB connection (requires MongoDB Realm SDK)
// Uncomment and configure if using MongoDB Realm for direct client connection
/*
import * as Realm from 'realm-web';

const REALM_APP_ID = import.meta.env.VITE_MONGODB_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID });

export const mongodbRealm = {
  async login() {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
    return user;
  },

  async getCollection(collectionName) {
    const user = await app.currentUser;
    if (!user) {
      await this.login();
    }
    const mongo = app.currentUser.mongoClient('mongodb-atlas');
    const db = mongo.db(import.meta.env.VITE_MONGODB_DATABASE_NAME || 'crm');
    return db.collection(collectionName);
  },

  async getContacts() {
    const contacts = await this.getCollection('contacts');
    return await contacts.find({});
  },

  async createContact(contact) {
    const contacts = await this.getCollection('contacts');
    return await contacts.insertOne(contact);
  },

  async updateContact(id, updates) {
    const contacts = await this.getCollection('contacts');
    return await contacts.updateOne(
      { _id: new Realm.BSON.ObjectId(id) },
      { $set: updates }
    );
  },

  async deleteContact(id) {
    const contacts = await this.getCollection('contacts');
    return await contacts.deleteOne({ _id: new Realm.BSON.ObjectId(id) });
  },
};
*/

export default mongodb;

