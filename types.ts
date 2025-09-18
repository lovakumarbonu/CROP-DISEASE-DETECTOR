import React from 'react';

export interface AnalysisResult {
  is_healthy: boolean;
  disease_name: string;
  description: string;
  treatment_plan_chemical: string[];
  treatment_plan_organic: string[];
  early_stress_signs: string[];
  climate_advisory: string;
  disease_location?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface HistoryItem {
  id: string;
  date: string;
  imagePreviewUrl: string;
  results: AnalysisResult[];
}

// FIX: Add missing StackItem interface, which was causing an error in components/StackHighlight.tsx.
export interface StackItem {
  category: string;
  icon: React.ReactNode;
  tool: string;
}

// FIX: Add missing Section interface, which was causing an error in components/SectionCard.tsx.
export interface Section {
  // FIX: Changed React.ReactElement to React.ReactElement<any> to fix type error when cloning the element with new props.
  icon: React.ReactElement<any>;
  title: string;
  categories: {
    category: string;
    items: {
      name: string;
      description: string;
    }[];
  }[];
}
