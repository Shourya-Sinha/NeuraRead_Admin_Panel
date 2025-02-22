import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Card, CardMedia, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTotalImagesByUser } from "../../Redux/SlicesFunction/DataSlice";


const GalleryPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { imagesByUser, isLoading, error } = useSelector(
    (state) => state.adminStats
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchTotalImagesByUser(userId));
    }
  }, [userId, dispatch]);

  // console.log("total images by user", imagesByUser);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3 }}>
        User Gallery
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
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={2}
      >
        {!isLoading && !error && imagesByUser?.length > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            gap={2}
          >
            {imagesByUser.map((imageUrl, index) => (
              <Card key={index} sx={{ boxShadow: 3, borderRadius: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={imageUrl}
                  alt={`User ${userId} Image ${index + 1}`}
                  sx={{objectFit:'contain'}}
                />
              </Card>
            ))}
          </Box>
        ) : (
          !isLoading &&
          !error && (
            <Typography variant="h6" color="textSecondary">
              No images available for this user.
            </Typography>
          )
        )}
      </Box>
    </Container>
  );
};

export default GalleryPage;
