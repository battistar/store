import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardActionArea,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import { AddShoppingCart as AddToCartIcon } from '@mui/icons-material';
import Product from 'models/Product';
import Rating from './Rating';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps): JSX.Element => {
  return (
    <Card>
      <CardActionArea>
        <CardMedia sx={{ height: 240, borderRadius: '4px', m: 2 }} image={product.thumbnail} title={product.title} />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.title}
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
            <Chip size="small" label={product.brand} sx={{ '&:hover': { cursor: 'pointer' } }} />
            <Chip size="small" label={product.category} sx={{ '&:hover': { cursor: 'pointer' } }} />
          </Stack>
        </CardContent>
      </CardActionArea>
      <Divider sx={{ mx: 1 }} />
      <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
        <Button size="small" variant="contained" startIcon={<AddToCartIcon />}>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
