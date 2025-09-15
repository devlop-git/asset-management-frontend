import { useLocation, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get error details from location state or URL params
  const errorCode = location.state?.status || new URLSearchParams(location.search).get('code') || '400';
  const errorMessage = location.state?.message || new URLSearchParams(location.search).get('message') || 'There was an issue with your request.';
  
  const getErrorTitle = (code) => {
    switch (code) {
      case '400': return '400 - Bad Request';
      case '401': return '401 - Unauthorized';
      case '403': return '403 - Forbidden';
      case '404': return '404 - Not Found';
      case '500': return '500 - Server Error';
      default: return `${code} - Error`;
    }
  };

  const getErrorDescription = (code) => {
    switch (code) {
      case '400': return 'There was an issue with your request. Please check the information you provided and try again.';
      case '401': return 'You are not authorized to access this resource. Please log in and try again.';
      case '403': return 'You do not have permission to access this resource.';
      case '404': return 'The page or resource you are looking for could not be found.';
      case '500': return 'There was an internal server error. Please try again later.';
      default: return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-24 w-24 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {getErrorTitle(errorCode)}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorDescription(errorCode)}
          </p>
          {errorMessage && errorMessage !== getErrorDescription(errorCode) && (
            <p className="mt-2 text-sm text-gray-500 italic font-bold">
              &ldquo;{errorMessage}&rdquo;
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;