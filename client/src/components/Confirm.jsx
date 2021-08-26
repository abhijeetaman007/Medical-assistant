// Implement Later
import React, { ReactElement } from "react";
import Modal from "react-modal";

export default function Confrim({
  options: { subText, yesHandler, noHandler, open },
}) {
  return (
      <Modal
        onRequestClose={noHandler}
        className="confirm"
        overlayClassName="overlay"
        isOpen={open}
      >
        <h1>Are You Sure?</h1>
        <p>{subText}</p>
        <button onClick={yesHandler}>Yes</button>
        <button onClick={noHandler}>No</button>
      </Modal>
  );
}