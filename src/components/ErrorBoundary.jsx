import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
          <h1 className="text-2xl font-bold text-[#000D57] mb-4">エラーが発生しました</h1>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            ページの読み込み中に問題が発生しました。ページを再読み込みしてください。
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#6E0000] text-white rounded-xl font-medium hover:bg-[#8a0000] transition-colors"
          >
            再読み込み
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
