import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";
const LinkForm = (props) => {
  const initialStateValues = {
    url: "",
    name: "",
    description: "",
  };

  const [values, setValues] = useState(initialStateValues);
  const validateUrl = (str) => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      str
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateUrl(values.url) && values.url !== "") {
      return toast("Error in form url", {
        type: "warning",
        autoClose: 2000,
      });
    }
    if (values.url === "" || values.name === "" || values.description === "") {
      return toast("Error in form, data empty", {
        type: "warning",
        autoClose: 2000,
      });
    }
    props.addOrEditLink(values);
    setValues({ ...initialStateValues });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const getLinkById = async (id) => {
    const doc = await db.collection("links").doc(id).get();
    console.log(doc.data());
    setValues({ ...doc.data() });
  };
  useEffect(() => {
    console.log(props.currentId);
    if (props.currentId === "") {
      setValues({ ...initialStateValues });
    } else {
      getLinkById(props.currentId);
    }
  }, [props.currentId]);
  return (
    <form className="card card-body border-primary " onSubmit={handleSubmit}>
      <div className="form-group input-group border-primary ">
        <div className="input-group-text bg-light">
          <i className="material-icons">insert_link</i>
        </div>
        <input
          type="text"
          className="form-control border-primary"
          placeholder="https://someurl.com"
          name="url"
          onChange={handleInputChange}
          value={values.url}
        />
      </div>
      <div className="form-group input-group  ">
        <div className="input-group-text bd-light">
          <i className="material-icons">create</i>
        </div>
        <input
          type="text"
          className="form-control border-primary"
          name="name"
          placeholder="WebSite Name"
          onChange={handleInputChange}
          value={values.name}
        />
      </div>
      <div className="form-group border-primary ">
        <textarea
          name="description"
          rows="3"
          className="form-control border-primary"
          placeholder="Write a Description"
          onChange={handleInputChange}
          value={values.description}
        ></textarea>
      </div>
      <button className="btn btn-outline-primary btn-block">
        {props.currentId === "" ? "Save" : "Update"}
      </button>
    </form>
  );
};
export default LinkForm;
