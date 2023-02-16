import { Stack, SxProps, Theme } from '@mui/material';
import { Star as StarIcon, StarHalf as StarHalfIcon, StarBorder as StarEmptyIcon } from '@mui/icons-material';

interface RatingProps {
  rating: number;
  sx?: SxProps<Theme>;
}

const Rating = ({ rating, sx }: RatingProps): JSX.Element => {
  let integer;
  let decimal;

  if (rating > 5) {
    integer = 5;
    decimal = 0;
  } else if (rating < 0) {
    integer = 0;
    decimal = 0;
  } else {
    integer = Math.trunc(rating);
    decimal = rating % 1;
  }

  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (integer > 0) {
      stars.push(<StarIcon key={i} fontSize="small" sx={{ color: 'gold' }} />);
      integer--;
    } else if (decimal > 0.5) {
      stars.push(<StarHalfIcon key={i} fontSize="small" sx={{ color: 'gold' }} />);
      decimal--;
    } else {
      stars.push(<StarEmptyIcon key={i} fontSize="small" sx={{ color: 'gold' }} />);
    }
  }

  return (
    <Stack direction="row" sx={{ ...sx }}>
      {stars}
    </Stack>
  );
};

export default Rating;
