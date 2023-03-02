import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
  CardActions,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { AddShoppingCart as AddToCartIcon } from '@mui/icons-material';
import Product from 'models/Product';
import Rating from './Rating';
import Carousel from 'react-material-ui-carousel';
import { useUser } from 'providers/user';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductDetailCardProps {
  product: Product;
  onClick: (id: number) => void;
}

const ProductDetailCard = ({ product, onClick }: ProductDetailCardProps): JSX.Element => {
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleAddProductClick = async (): Promise<void> => {
    if (!user) {
      setOpenDialog(true);

      return;
    }

    onClick(product.id);
  };

  const handleDialogClose = (): void => {
    setOpenDialog(false);
  };

  const handleLoginClick = (): void => {
    navigate('/login');
  };

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ borderRadius: '4px', mt: 2, mx: 2, flex: { md: 1 }, mb: { md: 2 } }}>
          <Carousel autoPlay={false}>
            {product.images.map((image) => {
              return (
                <CardMedia key={image} sx={{ height: { xs: 240, sm: 320 } }} image={image} title={product.title} />
              );
            })}
          </Carousel>
        </Box>
        <Box
          sx={{
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
            justifyContent: { md: 'space-between' },
            flex: { md: 2 },
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {product.title}
            </Typography>
            <Typography gutterBottom variant="body1" color="text.secondary" component="div">
              {product.description}
            </Typography>
            <Rating rating={product.rating} sx={{ my: 1 }} />
            <Stack direction="row" gap={1} alignItems="center">
              <Typography gutterBottom variant="h6" component="div">
                {product.price} $
              </Typography>
              <Typography gutterBottom variant="body1" color="red" component="div">
                -{product.discountPercentage} %
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" component="div">
              In stock: {product.stock}
            </Typography>
            <Stack direction="row" gap={1} mt={2}>
              <Chip size="small" label={product.brand} />
              <Chip size="small" label={product.category} />
            </Stack>
          </CardContent>
          <div>
            <Divider sx={{ mx: 1 }} />
            <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
              <Button onClick={handleAddProductClick} size="small" variant="contained" startIcon={<AddToCartIcon />}>
                Add to cart
              </Button>
            </CardActions>
          </div>
        </Box>
      </Card>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Login to add product</DialogTitle>
        <DialogContent>
          <DialogContentText>Before add product to the cart, please login.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleLoginClick} autoFocus>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductDetailCard;
