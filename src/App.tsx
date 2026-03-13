import { useState } from "react";
import { PomodoroTimer } from "./PomodoroTimer";
type Task = {
  completed: boolean;
  id: string;
  title: string;
};

function Tasks() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  function onSaveTask() {
    setTasks([
      ...tasks,
      { completed: false, id: crypto.randomUUID(), title: input },
    ]);

    setInput("");
  }

  function completeTask({ id }: Task) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }

        return task;
      }),
    );
  }

  function deletTask({id}: Task) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    < div className="taskContainer">
      <div>
        <input
          className="input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && input) {
              onSaveTask();
            }
          }}
          placeholder="Add a task"
        />

        <button 
          className="button" 
           onClick={input? onSaveTask : undefined}>
          Add
        </button>
      </div>

      <ul>
        {tasks.map((task) => {
          return (
            <li
              className={task.completed ? "itemCompleted" : "item"}
              key={task.id}
              onClick={() => completeTask(task)}
            >
              {task.title} 

              <button 
                  onClick={(event) => {
                  event.stopPropagation()
                  deletTask(task)
                }}
                className="ml-2 rounded p-1 bg-red-500"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Pomodoro() {
  return (
    <div className="container">
      <div className="timerSection">
        <PomodoroTimer />
      </div>
       <div className="divider"></div>

      <h1 className="title">Tasks</h1>

      <Tasks />
    </div>
  );
}