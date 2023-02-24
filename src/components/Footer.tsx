import { Box, Container, Link, Stack, Typography } from '@mui/material';

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
    <Box component="footer" sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}>
      <Container maxWidth="lg" sx={{ p: 1 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" component="span">
            © {date} Samuele Battistella
          </Typography>
          <Link variant="body2" underline="hover" color="inherit" href="https://dummyjson.com/" target="_blank">
            Powered by dummyjson.com
          </Link>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
