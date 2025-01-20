import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Company {
  _id: string;
  name: string;
  logo: string;
  description: string;
  industry: string;
  size: string;
  website: string;
  location: string;
  foundedYear: number;
  reviews: {
    rating: number;
    title: string;
    content: string;
    createdAt: string;
  }[];
}

const CompanyProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`/api/companies/${id}`);
        setCompany(res.data);
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center mb-4">
        <img src={company.logo || "/placeholder.svg"} alt={company.name} className="w-16 h-16 mr-4" />
        <h2 className="text-2xl font-bold">{company.name}</h2>
      </div>
      <p className="mb-2">{company.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <p><strong>Industry:</strong> {company.industry}</p>
        <p><strong>Size:</strong> {company.size}</p>
        <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{company.website}</a></p>
        <p><strong>Location:</strong> {company.location}</p>
        <p><strong>Founded:</strong> {companystrong> {company.location}</p>
        <p><strong>Founded:</strong> {company.foundedYear}</p>
      </div>
      <h3 className="text-xl font-semibold mb-2">Reviews</h3>
      {company.reviews.length > 0 ? (
        <div className="space-y-4">
          {company.reviews.map((review, index) => (
            <div key={index} className="border-t pt-4">
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 mr-2">{'★'.repeat(review.rating)}</span>
                <span className="font-semibold">{review.title}</span>
              </div>
              <p className="text-gray-600">{review.content}</p>
              <p className="text-sm text-gray-500 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default CompanyProfile;

