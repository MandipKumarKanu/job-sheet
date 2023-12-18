import React, { useEffect, useState } from "react";
import { useFirebase } from "../../context/firebaseContext";
import { Link } from "react-router-dom";
import "./home.css"

function Home() {
  const firebase = useFirebase();
  const [assignees, setAssignees] = useState([]);
  const [assigneeData, setAssigneeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState(null);

  const fetchAssignees = async () => {
    try {
      const assigneeList = await firebase.fetchAssigneeList("users");
      setAssignees(assigneeList);

      if (assigneeList.length > 0) {
        const data = await firebase.fetchAssigneeData("users", assigneeList[0]);
        setAssigneeData(data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching assignees:", error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchAssigneeTasks = async (assignee, index) => {
    try {
      setLoading(true);
      const data = await firebase.fetchAssigneeData("users", assignee);
      setAssigneeData(data);
    } catch (error) {
      console.error("Error fetching assignee data:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (index) => {
    setEditingTaskIndex(index);
    setEditedTask(assigneeData.tasks[index]);
  };

  const handleInputChange = (e) => {
    setEditedTask({
      ...editedTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveClick = async () => {
    try {
      await firebase.editAssigneeData("users", assigneeData.documentId, {
        tasks: assigneeData.tasks.map((task, index) =>
          index === editingTaskIndex ? editedTask : task
        ),
      });

      setEditingTaskIndex(null);
      setEditedTask(null);

      await fetchAssigneeTasks(assigneeData.documentId);
    } catch (error) {
      console.error("Error saving edited task:", error.message);
      setError(error.message);
    }
  };

  const handleDeleteClick = async (documentId, taskIndex) => {
    const isDeleted = await firebase.deleteAssigneeData(
      "users",
      documentId,
      taskIndex
    );

    if (isDeleted) {
      // Fetch updated data or perform any necessary actions after deletion
      await fetchAssignees();
    }
  };

  useEffect(() => {
    fetchAssignees();
  }, [firebase]);

  


  return (
    <>
      {error && <p>Error: {error}</p>}
      <div className="home">
        <div className="home-add">
          <Link to={`/assign`}>Assign Task</Link>
        </div>

        <div className="home-assignees">
          <label htmlFor="assigneeSelect">Select Assignee:</label>
          <select
            id="assigneeSelect"
            onChange={(e) =>
              fetchAssigneeTasks(e.target.value, e.target.selectedIndex)
            }>
            {assignees.map((assignee, index) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>

        <div className="home-table">
          <table>
            <thead>
              <tr>
                <th>Sn</th>
                <th>Assigner</th>
                <th>Task Name</th>
                <th>Task Description</th>
                <th>Assign Date</th>
                <th>Deadline Date</th>
                <th>Completion Date</th>
                <th colSpan={3}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td>Loading...</td>
                </tr>
              )}
              {assigneeData && assigneeData.tasks ? (
                assigneeData.tasks.map((task, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {editingTaskIndex === index ? (
                        <input
                          type="text"
                          name="assigner"
                          value={editedTask.assigner}
                          onChange={handleInputChange}
                        />
                      ) : (
                        task.assigner
                      )}
                    </td>
                    <td>
                      {editingTaskIndex === index ? (
                        <input
                          type="text"
                          name="taskname"
                          value={editedTask.taskname}
                          onChange={handleInputChange}
                        />
                      ) : (
                        task.taskname
                      )}
                    </td>
                    <td>
                      {editingTaskIndex === index ? (
                        <input
                          type="text"
                          name="task"
                          value={editedTask.task}
                          onChange={handleInputChange}
                        />
                      ) : (
                        task.task
                      )}
                    </td>
                    <td>{task.assignDate}</td>
                    <td>{task.deadDate}</td>
                    <td>{task.completeDate}</td>
                    <td>
                      {editingTaskIndex === index ? (
                        <>
                          <button onClick={handleSaveClick}>Save</button>
                          <button onClick={() => setEditingTaskIndex(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleEditClick(index)}>
                          Edit
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          handleDeleteClick(assigneeData.documentId, index)
                        }>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No tasks available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Home;
