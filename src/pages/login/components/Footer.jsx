import React from 'react'

function Footer() {
    return (
        //   <!-- Footer -->
  <footer className="bg-gray-900/50 border-t border-gray-800/30 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
      <div className="flex justify-center">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-primary to-accent w-10 h-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">SchoolDigify</h3>
              <p className="text-xs text-gray-400">Education ERP System</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Transforming educational institutions through innovative technology solutions.
          </p>
          <div className="flex space-x-3 sm:space-x-4">
            <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/50 hover:bg-primary/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
              <i className="fab fa-twitter text-sm sm:text-base"></i>
            </a>
            <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/50 hover:bg-primary/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
              <i className="fab fa-linkedin-in text-sm sm:text-base"></i>
            </a>
            <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/50 hover:bg-primary/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
              <i className="fab fa-facebook-f text-sm sm:text-base"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800/30 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          © 2024 SchoolDigify. All rights reserved. | 
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a> | 
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </p>
      </div>
    </div>
  </footer>
    )
}

export default Footer
