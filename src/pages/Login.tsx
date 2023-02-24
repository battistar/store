import { VisibilityOff as VisibilityOffIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import {
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useUser } from 'providers/user';
import axios from 'axios';

interface FormData {
  username: string;
  password: string;
}

const Login = (): JSX.Element => {
  const { user, login, isLoading, error } = useUser();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          enqueueSnackbar(error.response.data.message, {
            variant: 'error',
          });
        } else {
          enqueueSnackbar(`${error.response?.status} - ${error.response?.statusText}`, {
            variant: 'error',
          });
        }
      } else {
        enqueueSnackbar('Unknown error', { variant: 'error' });
      }
    } else {
      if (user) {
        navigate('/store', { replace: true });
      }
    }
  }, [enqueueSnackbar, error, navigate, user]);

  const handleClickShowPassword = (): void =>
    setShowPassword((show) => {
      return !show;
    });

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    await login(formData.username, formData.password);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        paddingTop: { xs: 2, md: 0 },
        height: { md: '100vh' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: { md: 'center' },
      }}
    >
      <Paper component="form" sx={{ padding: 2, width: '100%' }} onSubmit={handleSubmit}>
        <Stack gap={2}>
          <Typography variant="h5" textAlign="center">
            Login
          </Typography>
          <TextField
            name="username"
            variant="outlined"
            label="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              name="password"
              value={formData.password}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              onChange={handleChange}
            />
          </FormControl>
          <LoadingButton
            loading={isLoading}
            type="submit"
            color="primary"
            variant="contained"
            disabled={formData.username.trim() === '' || formData.password.trim() === ''}
          >
            Login
          </LoadingButton>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
