import { taskApi } from '../services/api'

const PRIORITY_COLORS = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-green-100 text-green-700',
}

const STATUS_COLORS = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.delete(task.id)
        onDelete(task.id)
      } catch {
        alert('Failed to delete task')
      }
    }
  }

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    try {
      await taskApi.updateStatus(task.id, newStatus)
      onStatusChange(task.id, newStatus)
    } catch {
      alert('Failed to update status')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      {/* Title + Priority badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug">{task.title}</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Due date */}
      {task.dueDate && (
        <p className="text-xs text-gray-400 mb-3">
          📅 Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {/* Status quick-change dropdown */}
      <div className="mb-3">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[task.status]}`}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      {/* Edit / Delete buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-1.5 rounded-lg transition-colors"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 font-medium py-1.5 rounded-lg transition-colors"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}
