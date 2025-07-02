import Card from "./Card";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";

export default function Overview(props) {
  const { currentUser } = useContext(UserContext);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setNewTaskTitle(selectedTask.title);
      setNewTaskDescription(selectedTask.description);
      setNewTaskStatus(selectedTask.status);
    } else {
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskStatus("");
    }
  }, [selectedTask]);

  function handleAddTask(e) {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: newTaskStatus,
    };

    fetch(`http://localhost:8000/users/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...currentUser,
        tasks: [...currentUser.tasks, newTask],
      }),
    }).then((res) => {
      if (res.ok) {
        console.log("Task added successfully");
        window.location.reload();
      }
    });
  }

  function handleUpdateTask(userId, taskId) {
    // Find the task to update
    const taskToUpdate = currentUser.tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      setSelectedTask(taskToUpdate);
      setShowUpdateModal(true);
    }
  }

  function handleUpdateSubmit(e, taskId) {
    e.preventDefault();
    const updatedTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      status: newTaskStatus,
    };

    fetch(`http://localhost:8000/users/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...currentUser,
        tasks: currentUser.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        ),
      }),
    }).then((res) => {
      if (res.ok) {
        console.log("Task updated successfully");
        setShowUpdateModal(false);
        setSelectedTask(null);
        window.location.reload();
      }
    });
  }

  function handleDeleteTask(userId, taskId) {
    // Get user data from server
    fetch(`http://localhost:8000/users/${userId}`)
      .then((res) => res.json())
      .then((user) => {
        // Filter out the task to delete
        const updatedTasks = user.tasks.filter((task) => task.id !== taskId);

        // Update backend
        fetch(`http://localhost:8000/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user, tasks: updatedTasks }),
        }).then((res) => {
          if (res.ok) {
            console.log("Task deleted successfully");
            window.location.reload();
          }
        });
      })
      .catch((err) => console.error("Error deleting task:", err));
  }

  return (
    <div className="overview container">
      <h2>Overview</h2>
      <div className="overview-content">
        <div className="cards">
          {!currentUser ? (
            <p>Loading...</p>
          ) : (
            <div className="cards-content">
              <Card
                cardTitle="Total Tasks"
                cardNumber={currentUser.tasks.length}
              />
              <Card
                cardTitle="Completed"
                cardNumber={
                  currentUser
                    ? currentUser.tasks.filter((t) => t.status === "completed")
                        .length
                    : "Loading..."
                }
              />
              <Card
                cardTitle="Pending"
                cardNumber={
                  currentUser
                    ? currentUser.tasks.filter((t) => t.status === "pending")
                        .length
                    : "Loading..."
                }
              />
            </div>
          )}
        </div>
        <div className="tasks">
          <div>
            <h3>Tasks</h3>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="add-task-btn" onClick={() => setShowModal(true)}>
              Add Task
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
              {currentUser ? (
                currentUser.tasks
                  .filter(
                    (task) =>
                      task.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      task.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((task) => (
                    <tr key={task.id}>
                      <td className="task-title">{task.title}</td>
                      <td className="task-status">{task.status}</td>
                      <td className="task-description">{task.description}</td>
                      <td className="task-actions">
                        <button
                          className="update-btn"
                          onClick={() =>
                            handleUpdateTask(currentUser.id, task.id)
                          }
                        >
                          Update
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteTask(currentUser.id, task.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <p>loading</p>
                  </td>
                </tr>
              )}
            </table>
          </div>
        </div>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add New Task</h3>
              <form onSubmit={handleAddTask}>
                <input
                  type="text"
                  placeholder="Task Title"
                  required
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  value={newTaskTitle}
                />
                <input
                  type="text"
                  placeholder="Task Description"
                  required
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  value={newTaskDescription}
                />
                <div className="status-group">
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      onChange={(e) => setNewTaskStatus(e.target.value)}
                    />
                    Pending
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="completed"
                      onChange={(e) => setNewTaskStatus(e.target.value)}
                    />
                    Completed
                  </label>
                </div>
                <div className="modal-buttons">
                  <button type="submit">Add</button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showUpdateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Update Task</h3>
              <form onSubmit={(e) => handleUpdateSubmit(e, selectedTask.id)}>
                <input
                  type="text"
                  placeholder="Task Title"
                  required
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  value={newTaskTitle}
                />
                <input
                  type="text"
                  placeholder="Task Description"
                  required
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  value={newTaskDescription}
                />
                <div className="status-group">
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={newTaskStatus === "pending"}
                      onChange={(e) => setNewTaskStatus(e.target.value)}
                    />
                    Pending
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="completed"
                      checked={newTaskStatus === "completed"}
                      onChange={(e) => setNewTaskStatus(e.target.value)}
                    />
                    Completed
                  </label>
                </div>
                <div className="modal-buttons">
                  <button type="submit">Update</button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateModal(false);
                      setSelectedTask(null);
                      setNewTaskTitle("");
                      setNewTaskDescription("");
                      setNewTaskStatus("");
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
