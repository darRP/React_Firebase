import React, { useEffect, useState } from "react";
import LinkForm from "./LinkForm";
import { db } from "../firebase";
import { toast } from "react-toastify";
const Links = () => {
  const [links, setLinks] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const addOrEditLink = async (linkObject) => {
    try {
      if (currentId === "") {
        await db.collection("links").doc().set(linkObject);
        toast("New Link Added", {
          type: "success",
        });
      } else {
        await db.collection("links").doc(currentId).update(linkObject);
        toast("Link updated Succesfull", {
          type: "info",
        });
        setCurrentId("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onDeleteLink = async (id) => {
    if (window.confirm("are you sure you want to delete this link?")) {
      await db.collection("links").doc(id).delete();
      toast("Link Removed Successfully", {
        type: "error",
        autoClose: 2000,
      });
    }
  };
  const getLinks = () => {
    db.collection("links").onSnapshot((querySnapShot) => {
      const docs = [];
      querySnapShot.forEach((element) => {
        docs.push({ ...element.data(), id: element.id });
      });
      setLinks(docs);
      console.log(docs);
    });
  };
  useEffect(() => {
    getLinks();
  }, []);
  return (
    <div className="div-content">
      <div className="col-md-4 p-2">
        <LinkForm {...{ addOrEditLink, currentId, links }} />
      </div>

      <div className="col-md-8 p-2">
        {links.map((link) => (
          <div className="card mb-1" key={link.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4>{link.name}</h4>
                <div>
                  <i
                    className="material-icons text-danger"
                    onClick={() => onDeleteLink(link.id)}
                  >
                    close
                  </i>
                  <i
                    className="material-icons"
                    onClick={() => setCurrentId(link.id)}
                  >
                    create
                  </i>
                </div>
              </div>

              <p>{link.description}</p>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                Go to WebSite
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Links;
