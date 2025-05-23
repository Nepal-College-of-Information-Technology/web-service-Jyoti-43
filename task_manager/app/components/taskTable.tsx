'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function TaskTable() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Swal.fire('Error', 'Failed to fetch tasks', 'error');
    }
  };

  const showTaskCreateBox = () => {
    Swal.fire({
      title: 'Create Task',
      html: `
        <input id="taskName" class="swal2-input" placeholder="Task Name">
        <input id="taskDescription" class="swal2-input" placeholder="Description">
      `,
      showCancelButton: true,
      confirmButtonText: 'Create',
      preConfirm: () => {
        const name = (document.getElementById('taskName') as HTMLInputElement).value;
        const description = (document.getElementById('taskDescription') as HTMLInputElement).value;
        if (!name || !description) {
          Swal.showValidationMessage('Please fill in all fields');
          return false;
        }
        return { name, description };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        createTask(result.value);
      }
    });
  };

  const createTask = async (task: { name: string; description: string }) => {
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      Swal.fire('Success', 'Task created successfully', 'success');
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      Swal.fire('Error', 'Failed to create task', 'error');
    }
  };

  const showTaskEditBox = (id: string, name: string, description: string) => {
    Swal.fire({
      title: 'Edit Task',
      html: `
        <input id="taskName" class="swal2-input" value="${name}">
        <input id="taskDescription" class="swal2-input" value="${description}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        const name = (document.getElementById('taskName') as HTMLInputElement).value;
        const description = (document.getElementById('taskDescription') as HTMLInputElement).value;
        if (!name || !description) {
          Swal.showValidationMessage('Please fill in all fields');
          return false;
        }
        return { name, description };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        updateTask(id, result.value);
      }
    });
  };

  const updateTask = async (id: string, task: { name: string; description: string }) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      Swal.fire('Success', 'Task updated successfully', 'success');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      Swal.fire('Error', 'Failed to update task', 'error');
    }
  };

  const deleteTask = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/api/tasks/${id}`, {
          method: 'DELETE',
        }).then(() => {
          Swal.fire('Deleted!', 'Task has been deleted.', 'success');
          fetchTasks();
        }).catch((error) => {
          console.error('Error deleting task:', error);
          Swal.fire('Error', 'Failed to delete task', 'error');
        });
      }
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <button
          onClick={showTaskCreateBox}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Create Task
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Task Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center">Loading...</td>
              </tr>
            ) : (
              tasks.map((task: { _id: string; name: string; description: string }, index: number) => (
                <tr key={task._id} className="border-b">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{task.name}</td>
                  <td className="py-3 px-4">{task.description}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => showTaskEditBox(task._id, task.name, task.description)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}