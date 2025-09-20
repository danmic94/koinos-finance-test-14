import React from 'react';

/**
 * Production-ready Error Boundary with comprehensive error handling
 * Features:
 * - Detailed error logging with context
 * - User-friendly fallback UI
 * - Retry functionality
 * - Development vs Production behavior
 * - Error reporting integration ready
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    // Capture additional error context
    const errorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      context: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.props.userId || 'anonymous',
        buildVersion: process.env.REACT_APP_VERSION || 'unknown',
        environment: process.env.NODE_ENV,
      },
      retryCount: this.state.retryCount,
      errorId: this.state.errorId,
    };

    // Store error info in state for display
    this.setState({ errorInfo });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 ErrorBoundary Caught an Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Full Context:', errorDetails);
      console.groupEnd();
    }

    // Log to external service (ready for integration)
    this.logErrorToService(errorDetails);

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorDetails);
    }
  }

  logErrorToService = (errorDetails) => {
    // Ready for integration with error reporting services
    // Examples: Sentry, LogRocket, Bugsnag, DataDog, etc.
    
    if (process.env.NODE_ENV === 'production') {
      // In production, you would send to your error reporting service
      // Example:
      // Sentry.captureException(errorDetails.error, {
      //   tags: { errorId: errorDetails.errorId },
      //   extra: errorDetails
      // });
      
      // For now, we'll store locally for debugging
      try {
        const errors = JSON.parse(localStorage.getItem('errorBoundaryLogs') || '[]');
        errors.push(errorDetails);
        // Keep only last 10 errors to prevent storage bloat
        const recentErrors = errors.slice(-10);
        localStorage.setItem('errorBoundaryLogs', JSON.stringify(recentErrors));
      } catch (storageError) {
        console.warn('Failed to store error log:', storageError);
      }
    }
  };

  handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI from props
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function' 
          ? this.props.fallback(this.state.error, this.handleRetry, this.state.retryCount)
          : this.props.fallback;
      }

      // Default fallback UI
      const maxRetries = this.props.maxRetries || 3;
      const canRetry = this.state.retryCount < maxRetries;

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Oops! Something went wrong
                </h2>
                
                <p className="text-sm text-gray-600 mb-6">
                  We encountered an unexpected error. This has been logged and our team will investigate.
                </p>

                {process.env.NODE_ENV === 'development' && (
                  <details className="mb-6 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      🔍 Error Details (Development)
                    </summary>
                    <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-left overflow-auto max-h-40">
                      <div className="mb-2">
                        <strong>Error ID:</strong> {this.state.errorId}
                      </div>
                      <div className="mb-2">
                        <strong>Message:</strong> {this.state.error?.message}
                      </div>
                      {this.state.error?.stack && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="whitespace-pre-wrap mt-1">{this.state.error.stack}</pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                <div className="space-y-3">
                  {canRetry && (
                    <button
                      onClick={this.handleRetry}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Try Again {this.state.retryCount > 0 && `(${this.state.retryCount}/${maxRetries})`}
                    </button>
                  )}
                  
                  <button
                    onClick={this.handleReload}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reload Page
                  </button>
                  
                  {this.props.onReportError && (
                    <button
                      onClick={() => this.props.onReportError(this.state.error, this.state.errorId)}
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Report Issue
                    </button>
                  )}
                </div>

                {this.state.retryCount >= maxRetries && (
                  <p className="mt-4 text-xs text-gray-500">
                    Maximum retry attempts reached. Please reload the page or contact support.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;