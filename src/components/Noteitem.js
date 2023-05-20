import React, { useContext } from "react";
import noteContext from "../context/notes/notecontext";

const Noteitem = (props) => {
  const { note, updateNote } = props;
  const context = useContext(noteContext);
  const { deleteNote } = context;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{note.title}</h5>

            <i
              className="far fa-edit mx-2  "
              onClick={() => {
                updateNote(note);
              }}
            ></i>
            <i
              className="far fa-trash-alt mx-2 "
              onClick={() => {
                deleteNote(note._id);
                props.showAlert("Note Deleted SuccessFully", "danger");
              }}
            ></i>
          </div>
          <br />
          <p className="card-text">{note.description}</p>"{note.tag}"
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
