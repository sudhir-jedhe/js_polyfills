// Implementing a notification system for internal users in a web application involves addressing several functional and non-functional requirements (NFRs). In this context, we'll discuss how you can build the notification system in React, ensuring it meets the requirements for scalability, reliability, and availability.

// Functional Requirements
// The functional requirements define what the notification system should do. For an internal user notification system, the key requirements might include:

// Real-time Notifications:

// Internal users should receive notifications in real time when specific events occur, such as new messages, status changes, or system alerts.
// Notification Types:

// The system should support different types of notifications, e.g., information, warnings, success, errors, etc.
// Each notification type might have different display behaviors or priorities.
// Notification Delivery:

// Notifications can be delivered in two primary ways:
// Push Notifications: Delivered even when the user is not actively looking at the page (e.g., through WebSockets or server-sent events).
// In-App Notifications: Displayed within the application as a popup or in a notification center when the user is interacting with the app.
// Notification Management:

// Users should be able to:
// Mark notifications as read.
// Dismiss or clear notifications.
// View a list of past notifications in a notification center.
// Prioritization and Grouping:

// Notifications should be prioritized based on importance.
// Related notifications could be grouped together to avoid overwhelming the user.
// User Preferences:

// Users should be able to customize notification settings, such as opting in or out of certain types of notifications (e.g., email, SMS, push notifications).
// Non-Functional Requirements (NFRs)
// The non-functional requirements address system characteristics that will ensure the application is scalable, reliable, and available.

// 1. Scalability:
// High Volume of Notifications: The system should be able to handle high volumes of notifications (e.g., a large number of users and notifications per second). It must be able to scale horizontally, meaning the notification system should be able to add resources as needed (more servers, distributed databases, etc.).
// Efficient Data Handling: Notifications should be delivered without significant delays or data overload. Using technologies like WebSockets, Pub/Sub systems, or message queues (e.g., Kafka, RabbitMQ) ensures scalability.
// Example Solution:

// Frontend (React): Use libraries like Redux or Context API to store and manage notification states. WebSockets can be used for real-time delivery, and notifications can be grouped and displayed accordingly.
// Backend (Node.js/Express): Use message queues (e.g., Kafka, RabbitMQ) or push notification services (e.g., Firebase Cloud Messaging) to manage and dispatch notifications at scale.
// 2. Reliability:
// Reliable Delivery: Notifications must be delivered to users without failure, even in the case of temporary network failures or high load. In the case of delivery failure, notifications should be retried.
// Persistence: Notifications should be stored in a database or cache to ensure that they can be retrieved even after the user refreshes or logs back into the app.
// Fallback Mechanisms: If real-time delivery fails (e.g., WebSocket connection issues), fallback mechanisms should ensure notifications are stored and delivered once the connection is restored.
// Example Solution:

// Backend: Implement retry mechanisms for failed notification deliveries. Use a database like MongoDB or PostgreSQL to store notifications persistently and a caching system like Redis for fast access.
// Frontend: Use libraries like Redux or React Context to maintain a reliable state of notifications even if the component is unmounted or the user navigates away.
// 3. Availability:
// High Availability: The notification system must be available 24/7 without downtime. This means implementing failover strategies, load balancing, and geographically distributed systems.
// Fault Tolerance: The system should gracefully handle failures. For instance, if a service is down, another service should take over, and users should not experience a degradation in service.
// Example Solution:

// Backend: Use microservices with load balancing, failover, and replication. Deploy services across multiple availability zones (e.g., AWS or Azure regions) for high availability.
// Frontend: Ensure the React app can gracefully handle failures in fetching or receiving notifications, possibly through retries or fallback UI elements.
// Architecture Overview
// Here’s a simplified architecture for the notification system:

// Frontend (React Application)

// WebSocket Connection: The React app establishes a WebSocket connection to the server for real-time updates.
// Redux or Context API: Used to manage and store notification state (e.g., notifications, unreadCount).
// UI Components: Components to display notifications (e.g., NotificationList, NotificationItem, NotificationCenter).
// Backend (Node.js/Express)

// Message Queue (Kafka/RabbitMQ): Used to handle high volumes of incoming events and queue them for delivery to users.
// WebSocket Server: A WebSocket server (using libraries like ws or Socket.io) broadcasts notifications in real time to connected clients.
// Notification Service: A microservice responsible for managing notifications (creation, delivery, and storage).
// Database: A database (e.g., PostgreSQL, MongoDB) stores notifications, keeping track of whether they are read, delivered, or pending.
// Push Notification Service: An optional service to send push notifications to users even when they are not actively using the app.
// External Systems

// User Preferences: A service that stores user preferences for notifications (e.g., preferred notification types, notification thresholds).
// Retry Mechanism: If notifications fail to be delivered (e.g., if a user’s WebSocket connection is interrupted), the system retries delivering the notification at a later time.


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, markNotificationRead } from './notificationSlice'; // Redux actions

const NotificationSystem = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications);
  
  // Establish WebSocket connection on mount
  useEffect(() => {
    const socket = new WebSocket('ws://yourserver.com/notifications');
    
    socket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      dispatch(addNotification(newNotification)); // Dispatch to Redux store
    };

    return () => socket.close();
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  return (
    <div className="notification-center">
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notif) => (
          <li key={notif.id} className={notif.read ? 'read' : 'unread'}>
            <span>{notif.message}</span>
            {!notif.read && (
              <button onClick={() => handleMarkAsRead(notif.id)}>Mark as Read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationSystem;



// notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      state.push(action.payload);
    },
    markNotificationRead: (state, action) => {
      const notification = state.find((notif) => notif.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    }
  }
});

export const { addNotification, markNotificationRead } = notificationSlice.actions;
export default notificationSlice.reducer;



// Simple WebSocket server example using ws
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Example: Sending a notification after 5 seconds
  setTimeout(() => {
    ws.send(JSON.stringify({ id: 1, message: 'New task assigned!', read: false }));
  }, 5000);
});
