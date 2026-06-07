import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import { taskApi } from '../services/api'

export default function DashboardPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const data = await taskApi.getAll()
      setTasks(data)
    } catch {
      alert('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClick = () => {
    setEditTask(null)
    setShowForm(true)
  }

  const handleEdit = (task) => {
    setEditTask(task)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditTask(null)
    loadTasks()
  }

  const handleDelete = (deletedId) => {
    setTasks((prev) => prev.filter((t) => t.id !== deletedId))
  }

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    )
  }

  const filteredTasks = filterStatus === 'ALL'
    ? tasks
    : tasks.filter((t) => t.status === filterStatus)

  const counts = {
    TODO: tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter((t) => t.status === 'DONE').length,
  }

  const FILTERS = [
    { key: 'ALL', label: 'All' },
    { key: 'TODO', label: 'To Do' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'DONE', label: 'Done' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
            <p className="text-gray-500 text-sm mt-1">{tasks.length} total tasks</p>
          </div>
          <button
            onClick={handleCreateClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors"
          >
            + New Task
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-gray-700">{counts.TODO}</div>
            <div className="text-xs text-gray-500 mt-1">To Do</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{counts.IN_PROGRESS}</div>
            <div className="text-xs text-gray-500 mt-1">In Progress</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{counts.DONE}</div>
            <div className="text-xs text-gray-500 mt-1">Done</div>
          </div>
        </div>

        {/* Task form (shown above list) */}
        {showForm && (
          <div className="mb-6">
            <TaskForm
              editTask={editTask}
              onSuccess={handleFormSuccess}
              onCancel={() => { setShowForm(false); setEditTask(null) }}
            />
          </div>
        )}

        {/* Filter buttons */}
        <div className="flex gap-2 mb-4">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${
                filterStatus === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No tasks found</p>
            <p className="text-sm mt-1">Click &quot;New Task&quot; to create your first task</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
