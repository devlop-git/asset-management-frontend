import { useForm } from 'react-hook-form';

export default function FormPage(props) {
  const { onFilter, onFilterChange, filterData} = props;
  
  const formConfig = {
    fields: [
      {
        id: "tagNo",
        type: "text",
        label: "TAG no/ Demand ID",
        placeholder: "Enter your TAG no/ Demand ID"
      },
      {
        id: "certificateType",
        type: "select",
        label: "Certificate Type",
        placeholder: "Enter your Certificate type",
        options: filterData.certificateType
      },
      {
        id: "stoneType",
        type: "select",
        label: "Stone Type",
        placeholder: "Enter your Stone Type",
        options: filterData.stoneType,
      },
      {
        id: "shape",
        type: "select",
        label: "Shape",
        required: false,
        options: filterData.shape
      },
      // {
      //   "id": "carat",
      //   "type": "select",
      //   "label": "Carat (Avg Wt)",
      //   "options": [
      //     { "value": "", "label": "Select a department" },
      //     { "value": "engineering", "label": "Engineering" },
      //   ]
      // },
      {
        id: "color",
        type: "select",
        label: "Color",
        required: false,
        options: filterData.color
      },
      {
        id: "clarity",
        type: "select",
        label: "Clarity",
        required: false,
        options: filterData.clarity
      },
      {
        id: "cut",
        type: "select",
        label: "Cut",
        required: false,
        options: filterData.cut
      },
      {
        id: "polish",
        type: "select",
        label: "Polish",
        required: false,
        options: filterData.polish
      },
      {
        id: "symmetry",
        type: "select",
        label: "Symmetry",
        required: false,
        options: filterData.symmetry
      },
      {
        id: "fluorescence",
        type: "select",
        label: "Fluorescence",
        required: false,
        options: filterData.fluorescence
      },
      // {
      //   "id": "intensity",
      //   "type": "select",
      //   "label": "Intensity",
      //   "required": false,
      //   "options": filterData.intensity
      // }
    ]
}

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
            {(field.options || []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  // if (isSubmitted) {
  //   return (
  //     <div className="max-w-2xl mx-auto">
  //       <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
  //         <div className="text-green-600 text-4xl mb-4">✓</div>
  //         <h2 className="text-xl font-semibold text-green-800 mb-2">Form Submitted Successfully!</h2>
  //         <p className="text-green-700">Thank you for your submission. The form will reset shortly.</p>
  //       </div>
  //     </div>
  //   );
  // }

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