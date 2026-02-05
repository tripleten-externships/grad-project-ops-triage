import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RequestCreate } from '@shared/types';
import { CATEGORY_VALUES, CHANNEL_VALUES, REQUESTER_TYPE_VALUES } from '@shared/constants';

/**
 * US-01: Request Submission Form
 * Allows users to submit new support requests
 */
function IntakePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<RequestCreate>>({
    title: '',
    description: '',
    category: 'general',
    priority: 'P2',
    status: 'new',
    requester_type: 'free',
    channel: 'web_form',
    tags: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Validate form data
    // TODO: Call API to create request
    // TODO: Handle errors
    // TODO: Show success message
    // TODO: Navigate to request detail or triage page
    
    console.log('Submitting request:', formData);
    alert('TODO: Implement request submission');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="intake-page">
      <h2>Submit Support Request</h2>
      <p>Please provide details about your support request.</p>
      
      <form onSubmit={handleSubmit} className="intake-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={5}
            maxLength={200}
            placeholder="Brief summary of your request"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            placeholder="Detailed description of your issue or request"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {CATEGORY_VALUES.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="requester_type">Account Type *</label>
          <select
            id="requester_type"
            name="requester_type"
            value={formData.requester_type}
            onChange={handleChange}
            required
          >
            {REQUESTER_TYPE_VALUES.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Request
        </button>
      </form>

      {/* TODO: Add form validation feedback */}
      {/* TODO: Add file upload capability */}
      {/* TODO: Add tags input */}
    </div>
  );
}

export default IntakePage;
