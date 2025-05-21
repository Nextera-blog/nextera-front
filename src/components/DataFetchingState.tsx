import { ReactNode } from "react";

interface DataFetchingStateProps {
    loading: boolean;
    error: string | null;
    children: ReactNode; // Content to be displayed on success (or absence of error/load)
  }
  
  const DataFetchingState: React.FC<DataFetchingStateProps> = ({
    loading,
    error,
    children,
  }) => {
    if (loading) {
      return (
        <main className="p-4 flex flex-col justify-center items-center grow">
          <p className="mb-2">Chargement...</p>
          <img
            src="/loader.gif"
            className="w-3xs h-8"
            alt="Chargement en cours..."
          />
        </main>
      );
    }
  
    if (error) {
      return (
        <main className="p-4 flex justify-center items-center grow">
          <p className="text-red-500 mb-4 bg-red-50 p-2 rounded-md">{error}</p>
        </main>
      );
    }
  
    return <>{children}</>;
  };
  
  export default DataFetchingState;