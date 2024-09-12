import React, { useEffect, useState } from "react";
import cls from "./Avatars.module.scss";
import { FaArrowLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";

function Avatars({ userInfo, getUserInfo }) {
  const [selectedImg, setSelectedimg] = useState("");
  const [state, setState] = useState({
    open: false,
    vertical: "",
    horizontal: "",
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => {
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const avatars = [
    {
      img: "http://localhost:3001/avatars/1.jpg",
      title: "Thomas Shelby",
    },
    {
      img: "http://localhost:3001/avatars/2.jpg",
      title: "El Profesor",
    },
    {
      img: "http://localhost:3001/avatars/3.jpg",
      title: "Kang Sae-Byeok",
    },
    {
      img: "http://localhost:3001/avatars/4.jpg",
      title: "Pablo Escobar",
    },
    {
      img: "http://localhost:3001/avatars/5.jpg",
      title: "Geralt of Rivia",
    },
    {
      img: "http://localhost:3001/avatars/6.jpg",
      title: "Wednesdey",
    },
    {
      img: "http://localhost:3001/avatars/7.jpg",
      title: "Sherlock Holmes",
    },
    {
      img: "http://localhost:3001/avatars/8.jpg",
      title: "Lucifer",
    },
    {
      img: "http://localhost:3001/avatars/9.jpg",
      title: "Daniel LaRusso",
    },
    {
      img: "http://localhost:3001/avatars/10.jpg",
      title: "Luffy",
    },
    {
      img: "http://localhost:3001/avatars/11.jpg",
      title: "Beth Harmon",
    },
    {
      img: "http://localhost:3001/avatars/12.jpg",
      title: "Sabrina Spellman",
    },
    {
      img: "http://localhost:3001/avatars/13.jpg",
      title: "Sully",
    },
  ];

  useEffect(() => {
    getUserInfo();
    window.scrollTo({ top: 0 });
  }, []);

  const changeAvatar = async (img) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await axios.post("http://localhost:3001/avatar/change", {
        token,
        img,
      });
      if (data) {
        getUserInfo();
        closeConfirm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showConfirm = (img) => {
    const confirm = document.querySelector(`.${cls.confirm}`);
    if (confirm) {
      if (img !== userInfo.avatar) {
        confirm.classList.add(cls.active);
        setSelectedimg(img);
      } else {
        handleClick({
          vertical: "top",
          horizontal: "center",
        });
      }
    }
  };

  const closeConfirm = () => {
    const confirm = document.querySelector(`.${cls.confirm}`);
    if (confirm) {
      confirm.classList.remove(cls.active);
    }
  };

  return (
    <div className={cls.avatarsContainer}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="Эта иконка уже используется"
        key={vertical + horizontal}
        sx={{ zIndex: 1000000 }}
      />
      <div className={cls.avatars}>
        <div className={cls.avatarsHeader}>
          <div className={cls.back}>
            <FaArrowLeft
              onClick={() => window.history.back()}
              className={cls.backIcon}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <h2 className={cls.changeTitle}>Редактировать профиль</h2>
              <span className={cls.selectTitle}>Выберите иконку профиля.</span>
            </div>
          </div>
          <div className={cls.user}>
            {userInfo.login}
            <div style={{ display: "flex", alignItems: "center" }}>
              {userInfo && userInfo.avatar && userInfo.avatar.length > 0 ? (
                <img
                  src={userInfo.avatar}
                  alt=""
                  style={{ width: "58px", borderRadius: "3px" }}
                />
              ) : (
                <i className="fa-solid fa-user"></i>
              )}
            </div>
          </div>
        </div>
        <div className={cls.slider}>
          {avatars.map((el) => {
            return (
              <div className={cls.avatar} onClick={() => showConfirm(el.img)}>
                <img src={el.img} alt="" />
                <p>{el.title}</p>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          <button className={cls.reset} onClick={() => changeAvatar("")}>
            Сбросить изменения
          </button>
        </div>
      </div>
      <div className={cls.confirm}>
        <div className={cls.confirmContainer}>
          <div className={cls.title}>Изменить иконку профиля?</div>
          <div className={cls.changeAvatars}>
            {userInfo && userInfo.avatar && userInfo.avatar.length > 0 ? (
              <div>
                <img
                  src={userInfo.avatar}
                  alt=""
                  style={{ width: "200px" }}
                  className={cls.confirmImg}
                />
              </div>
            ) : (
              <i className="fa-solid fa-user"></i>
            )}

            <div>
              <FaAngleRight style={{ fontSize: "28px" }} />
            </div>
            <div>
              <img
                src={selectedImg}
                alt=""
                style={{ width: "200px" }}
                className={cls.confirmImg}
              />
            </div>
          </div>
          <div className={cls.btns}>
            <button onClick={() => changeAvatar(selectedImg)}>
              Да, изменить
            </button>
            <button
              onClick={closeConfirm}
              style={{
                backgroundColor: "inherit",
                color: "hsla(0, 0%, 100%, 0.4)",
                border: "1.5px solid hsla(0, 0%, 100%, 0.4)",
              }}
            >
              Пока что нет
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Avatars;
