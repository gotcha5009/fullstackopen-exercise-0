import React from "react";

const PersonForm = ({
  handleSubmit,
  newName,
  handleName,
  newNum,
  handleNum,
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleName} />
        </div>
        <div>
          number: <input value={newNum} onChange={handleNum} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
