import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, CheckCircle, AlertCircle, GraduationCap, Briefcase, Book } from 'lucide-react';

const RequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  
  const departments = [
    { id: 'CSE', name: 'Computer Science' },
    { id: 'EE', name: 'Electrical Engineering' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    rollNo: '',
    mobileNo: '',
    alternativeNo: '',
    email: '',
    alternativeEmail: '',
    placed: 'no',
    placementDetails: '',
    futurePlans: 'job',
    higherStudiesDetails: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user profile');

        const data = await response.json();
        setUser(data.user);
        setFormData(prev => ({
          ...prev,
          name: data.user.name,
          branch: data.user.branch,
          email: data.user.email
        }));
      } catch (err) {
        setError('Failed to fetch user profile');
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);
  //@ts-ignore
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  //@ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/requests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit request');

      navigate('/dashboard', { 
        state: { message: 'Certificate request submitted successfully! You will be notified once it is processed.' }
      });
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === step 
              ? 'bg-indigo-600 text-white' 
              : currentStep > step 
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-20 h-1 ${
              currentStep > step ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-1">
            Roll Number
          </label>
          <input
            type="text"
            id="rollNo"
            name="rollNo"
            required
            value={formData.rollNo}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            placeholder="Enter your roll number"
          />
        </div>

        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="branch"
            name="branch"
            required
            value={formData.branch}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
          >
            <option value="">Select your department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Primary Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            placeholder="Enter your primary email"
          />
        </div>

        <div>
          <label htmlFor="alternativeEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Alternative Email
          </label>
          <input
            type="email"
            id="alternativeEmail"
            name="alternativeEmail"
            value={formData.alternativeEmail}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            placeholder="Enter alternative email (optional)"
          />
        </div>

        <div>
          <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobileNo"
            name="mobileNo"
            required
            value={formData.mobileNo}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            placeholder="Enter your mobile number"
          />
        </div>

        <div>
          <label htmlFor="alternativeNo" className="block text-sm font-medium text-gray-700 mb-1">
            Alternative Number
          </label>
          <input
            type="tel"
            id="alternativeNo"
            name="alternativeNo"
            value={formData.alternativeNo}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            placeholder="Enter alternative number (optional)"
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Are you currently placed?
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="placed"
              value="yes"
              checked={formData.placed === 'yes'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="placed"
              value="no"
              checked={formData.placed === 'no'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600"
            />
            <span>No</span>
          </label>
        </div>
      </div>

      {formData.placed === 'yes' && (
        <div>
          <label htmlFor="placementDetails" className="block text-sm font-medium text-gray-700 mb-1">
            Placement Details
          </label>
          <textarea
            id="placementDetails"
            name="placementDetails"
            required
            value={formData.placementDetails}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            placeholder="Please provide details about your placement (Company, Role, Location)"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Future Plans
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="futurePlans"
              value="Higher Studies"
              checked={formData.futurePlans === 'Higher Studies'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600"
            />
            <span>Higher Studies</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="futurePlans"
              value="Off Campus Prep"
              checked={formData.futurePlans === 'Off Campus Prep'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600"
            />
            <span>Off Campus Prep</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="Startup"
              value="other"
              checked={formData.futurePlans === 'Startup'}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600"
            />
            <span>Startup</span>
          </label>
        </div>
      </div>

      {/* {formData.futurePlans === 'higherStudies' && (
        <div>
          <label htmlFor="higherStudiesDetails" className="block text-sm font-medium text-gray-700 mb-1">
            Higher Studies Details
          </label>
          <textarea
            id="higherStudiesDetails"
            name="higherStudiesDetails"
            required
            value={formData.higherStudiesDetails}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
            placeholder="Provide details about your higher studies plans (University, Course, Country, etc.)"
          />
        </div>
      )} */}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Certificate Request Form
      </h2>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 1 && renderPersonalInfo()}
        {currentStep === 2 && renderContactInfo()}
        {currentStep === 3 && renderProfessionalInfo()}

        {error && (
          <div className="text-red-500 text-sm flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" /> {error}
          </div>
        )}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400 transition duration-150"
            >
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-green-700 transition duration-150"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin w-5 h-5" /> : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
