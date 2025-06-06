"use client";
import { useState } from 'react';
import GSTComponent from '@/components/common/GSTComponent';
import PANComponent from '@/components/common/PANComponent';

export default function TaxInformationComponent({
  data = {},
  onChange,
  title = "Tax Information",
  backgroundColor = "bg-green-50",
  borderColor = "border-green-200",
  required = false,
  showBoth = true,
  showGSTOnly = false,
  showPANOnly = false
}) {
  const handleGSTChange = (gstNumber) => {
    onChange({ ...data, gstNumber });
  };

  const handlePANChange = (panNumber) => {
    onChange({ ...data, panNumber });
  };

  const handleGSTVerificationSuccess = (gstData) => {
    // Auto-fill PAN from GST if available
    const updatedData = { ...data };
    if (gstData.panNumber && !data.panNumber) {
      updatedData.panNumber = gstData.panNumber;
    }
    if (gstData.companyName && !data.companyName) {
      updatedData.companyName = gstData.companyName;
    }
    if (gstData.state && !data.state) {
      updatedData.state = gstData.state;
    }
    onChange(updatedData);
  };

  const handlePANVerificationSuccess = (panData) => {
    // Handle PAN verification success
    const updatedData = { ...data };
    if (panData.holderName && !data.holderName) {
      updatedData.holderName = panData.holderName;
    }
    onChange(updatedData);
  };

  return (
    <div className="space-y-6">
      {(showBoth || showGSTOnly) && (
        <GSTComponent
          value={data.gstNumber || ''}
          onChange={handleGSTChange}
          onVerificationSuccess={handleGSTVerificationSuccess}
          required={required}
        />
      )}

      {(showBoth || showPANOnly) && (
        <PANComponent
          value={data.panNumber || ''}
          onChange={handlePANChange}
          onVerificationSuccess={handlePANVerificationSuccess}
          required={required}
        />
      )}
    </div>
  );
}