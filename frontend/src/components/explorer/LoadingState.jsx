/**
 * --------------------------------------------
 * Component: LoadingState
 * Purpose:
 * Displays a loading animation while
 * dinosaur data is being fetched from
 * the server or processed.
 * --------------------------------------------
 */
export default function LoadingState() {
    return (
        // Loading state container
        <div className="py-24 text-center">
             {/* Animated loading spinner */}
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#47613F] border-t-transparent"></div>
             {/* Loading message */}
            <p className="mt-6 text-lg text-gray-500">
                Searching the prehistoric world...
            </p>
        </div>
    );
}
