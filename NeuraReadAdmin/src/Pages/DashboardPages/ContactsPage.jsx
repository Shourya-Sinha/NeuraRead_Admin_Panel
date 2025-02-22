import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTotalContactsByUser } from "../../Redux/SlicesFunction/DataSlice";

const ContactsPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { contactsByUser, isLoading, error } = useSelector(
    (state) => state.adminStats
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchTotalContactsByUser(userId));
    }
  }, [dispatch, userId]);

  // Normalize data correctly by checking for both 'numbers' and 'phoneNumbers'
  const normalizedContacts = contactsByUser.map(contact => {
    // Ensure phoneNumbers is either an array or a string before proceeding
    let phoneNumbers = contact.phoneNumbers || contact.numbers;
  
    if (typeof phoneNumbers === 'string') {
      // If it's a string, split it into an array
      phoneNumbers = phoneNumbers.split(',').map(num => num.trim());
    }
  
    // Handle the case where phoneNumbers is undefined or empty
    if (!Array.isArray(phoneNumbers)) {
      phoneNumbers = [];
    }
  
    return {
      name: contact.name,
      phoneNumbers: phoneNumbers
    };
  });

  return (
    <Container maxWidth="lg" sx={{ mb: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        User Contacts
      </Typography>

      {isLoading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography variant="h6" color="error">
          Failed to fetch contacts. Please try again later.
        </Typography>
      )}
      {!isLoading && !error && normalizedContacts.length > 0 ? (
        <Box display="grid" gap={3}>
          {normalizedContacts.map((contact, index) => (
            <Card key={index} sx={{ p: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{contact.name}</Typography>
                {contact.phoneNumbers.length > 0 ? (
                  contact.phoneNumbers.map((phone, i) => (
                    <Typography key={i} variant="body2" color="textSecondary">
                      📞 {phone}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No phone numbers available
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="h6" color="textSecondary">
          No contacts available for this user.
        </Typography>
      )}
    </Container>
  );
};

export default ContactsPage;
