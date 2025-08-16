import React from 'react';
import CriticalErrorFallback from './CriticalErrorFallback';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("MentorX Critical Error Caught:", error, errorInfo);
    // In a real application, you might send the error to a logging service
  }
  
  handleRecovery = () => {
    // The most robust way to recover from an unknown UI error is to reload the application.
    // This clears all state and starts fresh.
    console.log("MentorX: Self-repair initiated. Rebooting application.");
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
          <CriticalErrorFallback error={this.state.error} onRecover={this.handleRecovery} />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;