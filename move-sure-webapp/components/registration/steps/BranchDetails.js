"use client";
import { useState } from 'react';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

export default function BranchDetails({ data, updateData }) {
  const [branches, setBranches] = useState(data.branches || []);

  const addBranch = () => {
    const newBranch = {
      id: Date.now(),
      name: '',
      address: '',
      city: '',
      state: ''
    };
    const updatedBranches = [...branches, newBranch];
    setBranches(updatedBranches);
    updateData('branches', updatedBranches);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Branches</h3>
        <p className="text-gray-600">Add multiple business locations (optional)</p>
      </div>

      {branches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No additional branches yet</h4>
          <p className="text-gray-600 mb-6">You can add branch locations later from your dashboard</p>
          <Button variant="outline" onClick={addBranch} icon="+" size="lg">
            Add First Branch
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {branches.map((branch, index) => (
            <div key={branch.id} className="bg-gray-50 rounded-xl p-6 border">
              <h4 className="font-semibold mb-4">Branch {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  placeholder="Branch name"
                  value={branch.name}
                  onChange={(value) => {
                    const updated = branches.map(b => 
                      b.id === branch.id ? {...b, name: value} : b
                    );
                    setBranches(updated);
                    updateData('branches', updated);
                  }}
                />
                <InputField
                  placeholder="Address"
                  value={branch.address}
                  onChange={(value) => {
                    const updated = branches.map(b => 
                      b.id === branch.id ? {...b, address: value} : b
                    );
                    setBranches(updated);
                    updateData('branches', updated);
                  }}
                />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addBranch} icon="+" className="w-full">
            Add Another Branch
          </Button>
        </div>
      )}
    </div>
  );
}