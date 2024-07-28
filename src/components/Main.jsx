import React, { Component } from "react";

class Main extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
    };

    this.addTask = this.addTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch("http://localhost:3000/tasks");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const tasks = await response.json();
      this.setState({ tasks });
    } catch (error) {
      console.error("Error caught: " + error);
    }
  }

  async addTask(event) {
    event.preventDefault();

    const input = document.getElementById("input_todo");

    const newTask = {
      task: input.value,
    };

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Error: " + response.status);
      }

      const newTaskObj = await response.json();
      this.setState((prevState) => ({
        tasks: [...prevState.tasks, newTaskObj],
      }));

      input.value = "";
    } catch (error) {
      console.error("Error caught: " + error);
    }
  }

  async deleteTask(taskID) {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error status:" + response.status);
      }

      this.setState((prevState) => ({
        tasks: prevState.tasks.filter((task) => task.id !== taskID),
      }));
    } catch (error) {
      console.error("Error while deleting" + error);
    }
  }

  render() {
    const { tasks } = this.state;
    return (
      <div className="main-container">
        <h2>TO DO APP</h2>
        <form onSubmit={this.addTask}>
          <div>
            <input
              type="text"
              placeholder="Enter task here..."
              required
              id="input_todo"
            />
            <button>ADD</button>
          </div>
        </form>
        <ul className="tasks">
          {tasks.map((task, index) => (
            <li key={index}>
              <input type="checkbox" id="checkBox_input" />
              <span>{task.task}</span>
              <button onClick={() => this.deleteTask(task.id)}>
                <i class="fa-solid fa-trash"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Main;
