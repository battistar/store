import { Container, Link, Stack, Typography } from '@mui/material';

const BUILD_YEAR = 2023;
const CURRENT_YEAR = new Date().getFullYear();

const Footer = (): JSX.Element => {
  let date;
  if (BUILD_YEAR !== CURRENT_YEAR) {
    date = `${BUILD_YEAR} - ${CURRENT_YEAR}`;
  } else {
    date = `${CURRENT_YEAR}`;
  }

  return (
    <Container component="footer" maxWidth="lg" sx={{ backgroundColor: (theme) => theme.palette.grey[200], p: 1 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" component="span">
          © {date} Samuele Battistella
        </Typography>
        <Link variant="body2" underline="hover" color="inherit" href="https://dummyjson.com/">
          Powered by dummyjson.com
        </Link>
      </Stack>
    </Container>
  );
};

export default Footer;
