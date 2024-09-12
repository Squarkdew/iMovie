import React, { useEffect, useState } from "react";
import cls from "./Auth.module.scss";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Auth({ userIsLogin, getIsAdmin }) {
  const [wrapper, setWrapper] = useState("log");

  const textFieldStyles = {
    marginTop: "12px",
    width: "100%",

    "& .MuiOutlinedInput-root": {
      color: "#fff",
      borderRadius: "20px",
      fontFamily: "Arial",
      fontWeight: "500",
      "&:hover:not(.Mui-focused)": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(211, 211, 222, 0.2)",
        },
      },

      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(211, 211, 222, 0.2)",
        borderWidth: "1px",
        transition: "border 0.2s",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#fff",
        borderWidth: "2px",
        transition: "border 0.2s",
      },
    },
    "& .MuiFormLabel-root": {
      color: "rgba(247, 247, 255, 0.5)",
    },
    "& .MuiFormLabel-root.Mui-focused ": {
      color: "#fff",
    },
  };

  const logWrapper = () => {
    setWrapper("log");
  };
  const regWrapper = () => {
    setWrapper("reg");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const handleRegister = async (body) => {
    try {
      if (body.password === body.confirmPassword) {
        const { data } = await axios.post(
          "http://localhost:3001/auth/register",
          body
        );

        if (data == "login") {
          setError("login", {
            message: "Это имя пользователя уже занято",
          });
        } else {
          reset();
          setWrapper("log");
        }
      } else {
        setError("confirmPassword", {
          message: "Пароли не совпадают",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const navigate = useNavigate();

  const handleLogin = async (body) => {
    const { data } = await axios.post("http://localhost:3001/auth/login", body);

    if (data === false) {
      setError("logLogin", {
        message: "Пользователь не найден. Провертье логин или пароль",
      });
    } else {
      localStorage.setItem("token", data.token);
      reset();
      userIsLogin();
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={cls.main}>
      <div
        className={cls.authSection}
        style={{
          marginTop: wrapper === "reg" ? "68px" : "0px",
        }}
      >
        <div className={cls.header}>
          <div>
            <span>iMovie</span>
            <img src="./images/id.png" alt="" className={cls.idIcon} />
          </div>
        </div>
        <div className={cls.container}>
          <div className={cls.containerHeader}>
            <h1>
              <span>Войдите или зарегистрируйтесь</span>
            </h1>
          </div>
          <div className={cls.authWrapper}>
            <div
              className={cls.login}
              onClick={logWrapper}
              style={{
                backgroundColor:
                  wrapper === "log"
                    ? "rgba(211, 211, 222, 0.15)"
                    : "rgba(211, 211, 222, 0)",
              }}
            >
              <span>Login</span>
            </div>
            <div
              className={cls.signUp}
              onClick={regWrapper}
              style={{
                backgroundColor:
                  wrapper === "reg"
                    ? "rgba(211, 211, 222, 0.15)"
                    : "rgba(211, 211, 222, 0)",
              }}
            >
              <span>Sign Up</span>
            </div>
          </div>
          {wrapper === "log" ? (
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className={cls.logControl}>
                <div>
                  <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ marginTop: "24px" }}
                  >
                    <TextField
                      className={cls.loginInput}
                      id="outlined-basic"
                      label="Логин или email"
                      autoComplete="off"
                      variant="outlined"
                      {...register("logLogin", {
                        required: true,
                      })}
                      error={!!errors.logLogin}
                      helperText={
                        (errors.logLogin && errors.logLogin.message) ||
                        (errors.logLogin && "Это поле обязательно")
                      }
                      sx={{
                        ...textFieldStyles,
                        marginTop: "0px",
                        ...(errors.logLogin && {
                          "& .MuiOutlinedInput-root:hover:not(.Mui-focused)": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#f33",
                            },
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#f33",
                            },
                        }),
                      }}
                    />

                    <FormControl
                      variant="outlined"
                      error={!!errors.logPassword}
                      sx={{
                        ...textFieldStyles,
                        ...(errors.logPassword && {
                          "& .MuiOutlinedInput-root:hover:not(.Mui-focused)": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#f33",
                            },
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#f33",
                            },
                        }),
                      }}
                    >
                      <InputLabel htmlFor="outlined-adornment-password">
                        Пароль
                      </InputLabel>
                      <OutlinedInput
                        autoComplete="off"
                        id="outlined-adornment-password"
                        {...register("logPassword", { required: true })}
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              sx={{ marginRight: "0px", color: "#fff" }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Пароль"
                      />
                      {errors.logPassword && (
                        <FormHelperText>Это поле обязательно</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </div>

                <div className={cls.logBtn}>
                  <button>Войти</button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit(handleRegister)}>
              <div className={cls.logControl}>
                <div>
                  <Box
                    component="div"
                    noValidate
                    autoComplete="off"
                    sx={{ marginTop: "24px" }}
                  >
                    <TextField
                      className={cls.loginInput}
                      id="outlined-basic"
                      label="Логин или email"
                      autoComplete="off"
                      variant="outlined"
                      {...register("login", {
                        required: true,
                      })}
                      error={!!errors.login}
                      helperText={
                        (errors.login && errors.login.message) ||
                        (errors.login && "Это поле обязательно")
                      }
                      sx={{
                        ...textFieldStyles,
                        marginTop: "0px",
                        ...(errors.login && {
                          "& .MuiOutlinedInput-root:hover:not(.Mui-focused)": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#f33",
                            },
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#f33",
                            },
                        }),
                      }}
                    />
                    <FormControl
                      variant="outlined"
                      error={!!errors.password}
                      sx={{
                        ...textFieldStyles,
                        ...(errors.password && {
                          "& .MuiOutlinedInput-root:hover:not(.Mui-focused)": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#f33",
                            },
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#f33",
                            },
                        }),
                      }}
                    >
                      <InputLabel htmlFor="outlined-adornment-password">
                        Пароль
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        {...register("password", {
                          required: true,
                          minLength: {
                            value: 6,
                            message:
                              "Пароль должен содержать от 6 до 60 символов.",
                          },
                          maxLength: {
                            value: 60,
                            message:
                              "Пароль должен содержать от 6 до 60 символов.",
                          },
                        })}
                        autoComplete="off"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              sx={{ marginRight: "0px", color: "#fff" }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Пароль"
                      />
                      {errors.password && (
                        <FormHelperText>
                          {errors.password.message || "Это поле обязательно"}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      error={!!errors.confirmPassword}
                      sx={{
                        ...textFieldStyles,
                        ...(errors.confirmPassword && {
                          "& .MuiOutlinedInput-root:hover:not(.Mui-focused)": {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#f33",
                            },
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#f33",
                            },
                        }),
                      }}
                    >
                      <InputLabel htmlFor="outlined-adornment-password">
                        Подтверждение пароля
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        {...register("confirmPassword", { required: true })}
                        type={showPassword ? "text" : "password"}
                        autoComplete="off"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              sx={{ marginRight: "0px", color: "#fff" }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Подтверждение пароля"
                      />
                      {errors.confirmPassword && (
                        <FormHelperText>
                          {errors.confirmPassword.message ||
                            "Это поле обязательно"}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </div>
                <div className={cls.logBtn}>
                  <button type="submit">Зарегистрироваться</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
