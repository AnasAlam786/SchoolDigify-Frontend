import React, { useState, useEffect } from 'react'
import { apiGet, apiPost } from '../../../api/api'

function ViewHoliday({ onClose }) {
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHolidays()
  }, [])

  const fetchHolidays = async () => {
    setError(null)
    setLoading(true)
    try {
      const response = await apiGet('/api/get_holidays')
      const data = await response.json()

      if (response.ok) {
        setHolidays(data.holidays || [])
        console.log(data.holidays)
      } else {
        showAlert(500, data.error || 'Failed to fetch holidays')
        setError(data.error || 'Failed to fetch holidays')
      }
    } catch (err) {
      showAlert(500, 'Failed to fetch holidays')
      console.error('Error fetching holidays:', err)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (batch_id) => {
    console.log(batch_id)
    if (!window.confirm('Are you sure you want to delete this holiday?')) {
      return
    }

    setError(null)
    try {
      const response = await apiPost(`/api/delete_holiday/${batch_id}`)
      const data = await response.json()

      if (response.ok) {
        setHolidays(prev => prev.filter(h => h.batch_id !== batch_id))
        showAlert(200, data.message)
      } else {
        showAlert(500, data.error || 'Failed to delete holiday')
        setError(data.error || 'Failed to delete holiday')
      }
    } catch (err) {
      showAlert(500, 'Failed to delete holiday')
      console.error('Error deleting holiday:', err)
      setError('Network error')
    }
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div
        className="absolute inset-0 bg-black/70 cursor-pointer"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#1A1A1A] rounded-2xl p-4 sm:p-6 w-full max-w-3xl mx-auto shadow-2xl border border-[#2A2A2A]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Marked Holidays</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div id="holidaysListContainer" className="space-y-3 max-h-[60vh] overflow-y-auto pb-2">
          {loading ? (
            <div className="text-center py-8">
              <span className="loader-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
              <p className="text-gray-400 mt-2">Loading...</p>
            </div>
          ) : holidays.length > 0 ? (
            holidays.map((holiday) => (
              <div
                key={holiday.id}
                className="bg-[#1C1C1C] border border-[#2A2A2A] p-4 rounded-xl flex items-start justify-between gap-4">

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-white font-semibold">{holiday.holiday_name}</div>
                      <div className="text-gray-400 text-sm mt-1">{holiday.class_name || "Entire School"} · <span className="font-medium">{holiday.days}</span> day(s)</div>
                    </div>

                  </div>
                  <div className="mt-3 text-xs text-gray-400">

                    {holiday.start_date === holiday.end_date
                      ? holiday.start_date
                      : `From ${holiday.start_date} To ${holiday.end_date}`
                    }
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(holiday.batch_id)}
                    className="flex items-center gap-2 px-4 py-2.5
               rounded-xl bg-red-600 text-white
               hover:bg-red-700 shadow-md
               transition-all duration-200"
                  >
                    <i className="fas fa-trash"></i>
                    <span>Delete</span>
                  </button>
                </div>


              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <i className="fas fa-inbox text-4xl opacity-50 mb-2"></i>
              <p>No holidays marked yet</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[#222] flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {holidays.length > 0 ? `Showing ${holidays.length} holiday(s)` : 'No holidays'}
          </div>
          <button
            onClick={() => {
              setLoading(true)
              fetchHolidays()
            }}
            className="text-sm px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewHoliday
