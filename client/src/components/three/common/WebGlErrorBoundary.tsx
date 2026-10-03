import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Layers } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  className?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Resilient Error Boundary specifically designed for Three.js Canvas containers.
 * Catches WebGL initialization failures, context loss, or shader runtime errors
 * and displays an accessible, brand-aligned fallback without crashing the parent page.
 */
export class WebGlErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.warn('[SevaSetu 3D] WebGL or Three.js scene error caught gracefully:', error, errorInfo);
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="region"
          aria-label="3D visual alternative"
          className={`flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-neutral-50/80 border border-neutral-200/80 text-neutral-600 ${this.props.className || 'h-64'}`}
        >
          <div className="p-3 mb-2 rounded-full bg-primary-50 text-primary-600">
            <Layers size={24} />
          </div>
          <h3 className="text-sm font-semibold text-neutral-800">
            {this.props.fallbackTitle || 'Interactive Visual Experience'}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-1">
            {this.props.fallbackDescription ||
              'Standard view active. All platform services, bookings, and navigation remain fully functional.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
