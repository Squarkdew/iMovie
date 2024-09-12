import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import cls from "./AddMovie.module.scss";

function AddMovie(props) {
  const [persons, setPersons] = useState([]);
  const [allPersons, setAllPersons] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [changeInput, setChangeInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const inputs = [
    "title",
    "engTitle",
    "rating",
    "year",
    "genre",
    "country",
    "duration",
    "age",
    "miniSummary",
    "summary",
    "budget",
    "usFees",
    "worldFees",
    "worldPremiere",
    "video",
    "trailerTitle",
    "trailer",
    "trailerPhoto",
    "poster",
    "searchPoster",
    "windowPoster",
    "pngTitle",
  ];

  const add = async (body) => {
    try {
      const newPersons = persons.map((el) => {
        return { personId: el.id, nameInMovie: el.nameInMovie };
      });
      const { data } = await axios.post(
        "http://localhost:3001/admin/addMovie",
        { ...body, persons: newPersons }
      );
      if (data) {
        console.log("Успешно");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPersons = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const { data } = await axios.post("http://localhost:3001/getPersons", {
        token,
      });
      setAllPersons(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const text = inputValue ? inputValue.toLocaleLowerCase() : "";

  const startsWithText = allPersons.filter((el) => {
    const personName = el.name ? el.name.toLocaleLowerCase() : "";
    const personEngName = el.engName ? el.engName.toLocaleLowerCase() : "";

    return personName.startsWith(text) || personEngName.startsWith(text);
  });

  const includesText = allPersons.filter((el) => {
    const personName = el.name ? el.name.toLocaleLowerCase() : "";
    const personEngName = el.engName ? el.engName.toLocaleLowerCase() : "";

    return (
      (personName.includes(text) || personEngName.includes(text)) &&
      !(personName.startsWith(text) || personEngName.startsWith(text))
    );
  });

  const inputSearchs = [...startsWithText, ...includesText];

  useEffect(() => {
    getPersons();
  }, []);

  const removePerson = (el) => {
    setPersons(persons.filter((person) => person.id !== el.id));
  };

  const addPerson = (el) => {
    if (!persons.some((person) => person.id === el.id)) {
      setPersons([...persons, el]);
    }
  };

  const changePersons = (id, nameInMovie) => {
    const newPersons = persons.map((el) =>
      el.id === id ? { ...el, nameInMovie } : el
    );
    setPersons(newPersons);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={cls.formContainer}>
      <form onSubmit={handleSubmit(add)} className={cls.form}>
        {inputs.map((el, index) => (
          <input
            key={index}
            {...register(el, { required: true })}
            placeholder={el}
            className={cls.inputs}
          />
        ))}
        <div className={cls.personsPreview}>
          <div>
            <input
              type="text"
              spellCheck="false"
              placeholder="Фильмы и сериалы"
              value={inputValue}
              className={cls.input}
              onChange={handleInputChange}
            />

            {inputValue && (
              <div className={cls.inputResults}>
                {inputSearchs.length > 0 ? (
                  inputSearchs.map((el) => (
                    <div
                      key={el.id}
                      className={cls.currentInputResult}
                      onClick={() => addPerson(el)}
                    >
                      <img src={el.photo} alt="" />
                      <div className={cls.currentResultInfo}>
                        <p>{el.name}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={cls.notFound}>
                    По вашему запросу ничего не найдено
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={cls.tableTop}>
            {persons.map((el) => (
              <div key={el.id} className={cls.currentInputResult}>
                <img src={el.photo} alt="" />
                <div className={cls.currentResultInfo}>
                  <p>{el.name}</p>
                  <input
                    type="text"
                    value={el.nameInMovie}
                    onChange={(e) => changePersons(el.id, e.target.value)}
                  />
                </div>
                <i
                  className="fa-solid fa-xmark"
                  onClick={() => removePerson(el)}
                ></i>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className={cls.public}>
          Опубликовать
        </button>
      </form>
    </div>
  );
}

export default AddMovie;
