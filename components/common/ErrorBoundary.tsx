'use client'

import React from 'react'

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 max-w-md">
            <h1 className="text-lg font-bold text-red-400 mb-2">Error</h1>
            <p className="text-slate-400 text-sm mb-4">{this.state.error?.message}</p>
            <button onClick={() => this.setState({ hasError: false })} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}