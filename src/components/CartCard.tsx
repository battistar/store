import { IconButton, Typography, Stack, Tooltip, Link, Box } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import CartProduct from 'models/CartProduct';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

interface CartCardProps {
  product: CartProduct;
  onDelete: (id: number) => void;
}

const CartCard = ({ product, onDelete }: CartCardProps): JSX.Element => {
  const navigate = useNavigate();

  const handleTitleClick = useCallback((): void => {
    navigate(`/store/product/${product.id}`);
  }, [product.id, navigate]);

  const handleDeleteClick = useCallback((): void => {
    onDelete(product.id);
  }, [product.id, onDelete]);

  return (
    <Stack direction="row" alignItems="center" p={2}>
      <Box flex={1}>
        <Link onClick={handleTitleClick} component="button" variant="body1" color="inherit" underline="hover">
          {product.title}
        </Link>
      </Box>
      <Typography variant="body2" component="div" color="text.secondary" mr={2}>
        x{product.quantity}
      </Typography>
      <Stack alignItems="center" mr={2}>
        <Typography variant="body1" component="div">
          {product.price} $
        </Typography>
        <Typography variant="body2" component="div" color="text.secondary">
          - {product.discountPercentage} %
        </Typography>
      </Stack>
      <Tooltip title="Remove">
        <IconButton onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default CartCard;
