import React from "react";
import cls from "./AddPerson.module.scss";
import axios from "axios";
import { useForm } from "react-hook-form";

function AddPerson(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();
  const inputs = [
    "name",
    "engName",
    "photo",
    "career",
    "birthday",
    "birthplace",
    "genres",
    "height",
    "hasOscars",
  ];

  const add = async (body) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3001/admin/addPerson",
        body
      );
      if (data) {
        console.log("Успешно");
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={cls.formContainer}>
      <form onSubmit={handleSubmit(add)} className={cls.form}>
        {inputs.map((el) => {
          return (
            <input
              type="text"
              {...register(el, { required: true })}
              placeholder={el}
              className={cls.inputs}
            />
          );
        })}
        <button type="submit" className={cls.public}>
          Опубликовать
        </button>
      </form>
    </div>
  );
}

export default AddPerson;
