// Assign.js
import React, { useState } from "react";
import { useFirebase } from "../../context/firebaseContext";
import "./assign.css";

function Assign() {
  const firebase = useFirebase();
  const [assignee, setAssignee] = useState("");
  const [assigner, setAssigner] = useState("");
  const [taskname, setTaskName] = useState("");
  const [task, setTask] = useState("");
  const [assignDate, setAssignDate] = useState("");
  const [deadDate, setDeadDate] = useState("");
  const [completeDate, setCompleteDate] = useState("");
  const [assigneeConform, setAssigneeConform] = useState("");
  const [assignerConform, setAssignerConform] = useState("");

  const handleAssign = async (e) => {
    e.preventDefault();

    try {
        // Use assignee as the document ID
        const userData = await firebase.storeData("users", assignee, {
          assigner,
          taskname,
          task,
          assignDate,
          deadDate,
          completeDate,
          assigneeConform,
          assignerConform,
        });
  
        alert("Data stored successfully");
      } catch (error) {
        alert(error.message);
      }
    };

  return (
    <>
      <section id="assign">
        <div className="form-container assign-container">
          <span>Get a Task😣</span>
          <form onSubmit={handleAssign}>
            <div className="form-grp1">
              <div className="form-grp">
                <label htmlFor="assignee">assignee</label>
                <input
                  type="text"
                  name="assignee"
                  id="assignee"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                />
              </div>
              <div className="form-grp">
                <label htmlFor="assigner">assigner</label>
                <input
                  type="text"
                  name="assigner"
                  id="assigner"
                  value={assigner}
                  onChange={(e) => setAssigner(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grp">
              <label htmlFor="taskname">Task Name</label>
              <input
                type="text"
                id="taskname"
                value={taskname}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <div className="form-grp">
              <label htmlFor="taskDescription">Task Description</label>
              <textarea
                id="taskDescription"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>

            <div className="form-grp1">
              <div className="form-grp">
                <label htmlFor="assignDate">Assign Date</label>
                <input
                  type="date"
                  id="assignDate"
                  value={assignDate}
                  onChange={(e) => setAssignDate(e.target.value)}
                />
              </div>

              <div className="form-grp">
                <label htmlFor="deadDate">Deadline Date</label>
                <input
                  type="date"
                  id="deadDate"
                  value={deadDate}
                  onChange={(e) => setDeadDate(e.target.value)}
                />
              </div>

              <div className="form-grp">
                <label htmlFor="completeDate">Completed Date</label>
                <input
                  type="date"
                  id="completeDate"
                  value={completeDate}
                  onChange={(e) => setCompleteDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grp1">
              <div className="form-grp">
                <label htmlFor="assigneeConform">Assignee Conform</label>
                <input
                  type="text"
                  id="assigneeConform"
                  value={assigneeConform}
                  onChange={(e) => setAssigneeConform(e.target.value)}
                />
              </div>

              <div className="form-grp">
                <label htmlFor="assignerConform">Assigner Conform</label>
                <input
                  type="text"
                  id="assignerConform"
                  value={assignerConform}
                  onChange={(e) => setAssignerConform(e.target.value)}
                />
              </div>
            </div>

            <div className="button">
              <button type="submit">Assign</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Assign;