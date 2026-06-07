import { useState, useEffect } from 'react'
import { taskApi, aiApi } from '../services/api'

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  dueDate: '',
  status: 'TODO',
}

export default function TaskForm({ editTask, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  // Pre-fill form when editing
  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || 'MEDIUM',
        dueDate: editTask.dueDate || '',
        status: editTask.status || 'TODO',
      })
    }
  }, [editTask])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  // AI auto-fill — calls /api/ai/generate
  const handleAiGenerate = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a task title first to use AI generation')
      return
    }
    setAiLoading(true)
    setAiMessage('')
    try {
      const res = await aiApi.generate(formData.title)
      setFormData((prev) => ({
        ...prev,
        description: res.description || prev.description,
        priority: res.priority || prev.priority,
      }))
      if (res.aiGenerated) {
        setAiMessage(`✨ AI suggests: Priority = ${res.priority}, Estimated time = ${res.estimatedTime}`)
      } else {
        setAiMessage('⚠️ AI unavailable. Showing default suggestion.')
      }
    } catch {
      setAiMessage('⚠️ AI service unavailable right now.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Task title is required')
      return
    }
    setLoading(true)
    try {
      if (editTask) {
        await taskApi.update(editTask.id, formData)
      } else {
        await taskApi.create(formData)
      }
      onSuccess()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-5">
        {editTask ? 'Edit Task' : 'Create New Task'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title + AI button */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Prepare client presentation"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={aiLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap transition-colors"
            >
              {aiLoading ? '⏳ Generating...' : '✨ AI Fill'}
            </button>
          </div>
          {aiMessage && (
            <p className="text-xs mt-1 text-purple-700 bg-purple-50 rounded px-2 py-1">
              {aiMessage}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Task description..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Priority + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
