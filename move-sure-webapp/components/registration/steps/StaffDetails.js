"use client";
import { useState } from 'react';
import Button from '@/components/common/Button';

export default function StaffDetails({ data, updateData }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Staff Management</h3>
        <p className="text-gray-600 mb-6">You can invite staff members and assign roles later from your dashboard</p>
        <Button variant="outline" size="lg">
          Skip for Now
        </Button>
      </div>
    </div>
  );
}