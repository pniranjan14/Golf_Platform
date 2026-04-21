import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GlowButton } from './GlowButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in component [${this.props.name || 'Unknown'}]:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="py-12 px-6">
          <GlassCard className="max-w-xl mx-auto text-center p-12 border-rose-500/20 bg-rose-500/5">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Interface Error</h3>
            <p className="text-[#9b99c4] text-sm mb-8 leading-relaxed">
              We encountered an issue rendering this section of the elite platform. 
              Our systems have logged the event for resolution.
            </p>
            <GlowButton 
              label="Reload Interface" 
              onClick={this.handleReset}
              className="bg-rose-600 hover:bg-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.3)]"
            />
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-8 p-4 bg-black/40 rounded-xl text-left overflow-auto max-h-40">
                <code className="text-[10px] text-rose-300 font-mono whitespace-pre">
                  {this.state.error.toString()}
                </code>
              </div>
            )}
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
