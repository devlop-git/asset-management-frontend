import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export default function FormPage(props) {
  const { onFilter, onFilterChange, formConfig } = props;
  const { filters } = useAuth();

  const storedFilters = useMemo(() => {
    try {
      const raw = localStorage.getItem('filters');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const effectiveFilters = filters || storedFilters || {};

  // removed submit success UI state, fetching happens on button click
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm();

  const onSubmit = (data) => {
    if (onFilter) {
      onFilter(data);
    }
    reset();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (onFilterChange) {
      onFilterChange({ [name]: value });
    }
  };

  const renderField = (field) => {
    const fieldProps = {
      id: field.id,
      ...register(field.id, {
        required: field.required ? `${field.label} is required` : false,
        name: field.id,
        pattern: field.validation?.pattern ? {
          value: new RegExp(field.validation.pattern),
          message: `Please enter a valid ${field.label.toLowerCase()}`
        } : undefined
      })
    };

    const options =
      field.options ||
      (field.optionsFrom && Array.isArray(effectiveFilters[field.optionsFrom])
        ? effectiveFilters[field.optionsFrom]
        : []);

    switch (field.type) {
      case 'text':     
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className={`form-input ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
            onChange={handleChange}
          />
        );

      case 'select':
        return (
          <select
            className={`form-select ${errors[field.id] ? 'border-red-500' : ''}`}
            {...fieldProps}
            onChange={handleChange}
          >
            <option value="">All</option>
            {(options || []).map((option) => (
              <option key={String(option)} value={option}>
                {String(option)}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3">       
          {formConfig.fields.map((field) => (
            <div key={field.id}>
              {field.type !== 'checkbox' && (
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              {renderField(field)}    
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