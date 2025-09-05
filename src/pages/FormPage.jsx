import { useState } from 'react';
import { useForm } from 'react-hook-form';
import formConfig from '../config/formConfig.json';

export default function FormPage(props) {
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form data:', data);
    setIsSubmitted(true);
    props.onFilter(data);
    setTimeout(() => {
      setIsSubmitted(false);
      reset();
    }, 3000);
  };

  const renderField = (field) => {
    const fieldProps = {
      id: field.id,
      ...register(field.id, {
        required: field.required ? `${field.label} is required` : false,
        minLength: field.validation?.minLength ? {
          value: field.validation.minLength,
          message: `Minimum length is ${field.validation.minLength} characters`
        } : undefined,
        maxLength: field.validation?.maxLength ? {
          value: field.validation.maxLength,
          message: `Maximum length is ${field.validation.maxLength} characters`
        } : undefined,
        pattern: field.validation?.pattern ? {
          value: new RegExp(field.validation.pattern),
          message: `Please enter a valid ${field.label.toLowerCase()}`
        } : undefined
      })
    };

    switch (field.type) {
      case 'text':     
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className={`form-input ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
          />
        );

      case 'select':
        return (
          <select
            className={`form-select ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">Form Submitted Successfully!</h2>
          <p className="text-green-700">Thank you for your submission. The form will reset shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        {/* <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{formConfig.title}</h1>
          <p className="text-gray-600">{formConfig.description}</p>
        </div> */}
       

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">       
          
          {formConfig.fields.map((field) => (
            <div key={field.id}>
              {field.type !== 'checkbox' && (
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              
              {renderField(field)}    
              
              {/* {errors[field.id] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.id].message}</p>
              )} */}
            </div>
          ))}

          <div className="pt-8">
            <button
              type="submit"
              className="text-white end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Filter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}