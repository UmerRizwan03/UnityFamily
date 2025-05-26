// pages/HomePage.js

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import FamilyTreeChart from './FamilyTreeChart';
import { formatTreeData } from './FormatTreeData';
import { getLayoutedElements } from './GetLayoutedElements';

const HomePage = () => {
  const [members, setMembers] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: membersData, error: membersError } = await supabase
          .from('family_members')
          .select('id, name, birth_date, gender, blood_type, country_code, mobile_number, role, image_url');

        if (membersError) throw membersError;

        const { data: relationshipsData, error: relationshipsError } = await supabase
          .from('relationships')
          .select('*');

        if (relationshipsError) throw relationshipsError;

        setMembers(membersData);
        setRelationships(relationshipsData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-neutral-300">Loading family data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading data: {error.message}</div>;
  }

  const { nodes, edges } = formatTreeData(members, relationships);
  const layouted = getLayoutedElements(nodes, edges);

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8 flex flex-col items-center">
      <header className="max-w-7xl mx-auto text-center mb-12 md:mb-16 mt-24">
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-3 md:mb-4">Family Tree</h1>
        <p className="text-neutral-300 max-w-2xl mx-auto text-sm md:text-base">Visualize and explore the connections within our family.</p>
      </header>
      <main className="flex-grow w-full">
        <section className="bg-neutral-800/50 rounded-lg shadow-lg p-6 md:p-8 border border-neutral-700 w-full">
          <div style={{ width: '100%', height: '100%' }} className="bg-transparent">
            <FamilyTreeChart initialNodes={layouted.nodes} initialEdges={layouted.edges} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
