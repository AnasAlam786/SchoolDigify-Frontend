import React, { useState } from 'react'
import { apiPost } from '../../../api/api'

function MarkHoliday({ classes, onClose }) {
  const [formData, setFormData] = useState({
    holiday_name: '',
    start_date: '',
    end_date: '',
    apply_to: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!formData.holiday_name || !formData.start_date || !formData.end_date) {
      setError('Please fill all required fields')
      return
    }

    setLoading(true)

    try {
      console.log(formData.holiday_name, formData.start_date, formData.end_date, formData.apply_to,)
      const response = await apiPost('/api/add-holiday', {
        holiday_name: formData.holiday_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        apply_to: formData.apply_to,
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        
        showAlert(200, data.message)
        setFormData({
          holiday_name: '',
          start_date: '',
          end_date: '',
          apply_to: '',
        })
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setError(data.error || 'Failed to mark holiday')
        showAlert(500, data.error || 'Failed to mark holiday')
      }
    } catch (err) {
      console.error('Error marking holiday:', err)
      showAlert(500, 'Failed to mark holiday')
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div
        className="absolute inset-0 bg-black/70 cursor-pointer"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#1A1A1A] rounded-2xl p-4 sm:p-6 w-full max-w-lg mx-auto shadow-2xl border border-[#2A2A2A]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Mark Holiday</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Holiday Name *</label>
            <input
              type="text"
              name="holiday_name"
              value={formData.holiday_name}
              onChange={handleChange}
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="e.g. Winter Break"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date Range *</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="flex-1 bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
              <div className="flex items-center justify-center text-gray-400 py-2">to</div>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="flex-1 bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Apply To</label>
            <select
              name="apply_to"
              value={formData.apply_to}
              onChange={handleChange}
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="">Entire School</option>
              {classes && classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="loader-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-calendar-plus"></i>
                  <span>Mark as Holiday</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MarkHoliday
