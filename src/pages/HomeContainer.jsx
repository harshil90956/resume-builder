import React from 'react';
import { useQuery } from 'react-query';
import { getTemplates } from '../api';
import useFilters from '../hooks/useFilters';
import { TemplateDesignPin } from '../components';

const HomeContainer = () => {
  const { data: templates, isLoading, isError } = useQuery('templates', getTemplates);
  const { data: filterData } = useFilters();

  const filteredTemplates = templates?.filter(template => {
    const searchTerm = filterData?.searchTerm.toLowerCase();
    return (
      template.title.toLowerCase().includes(searchTerm) ||
      template.description?.toLowerCase().includes(searchTerm) ||
      (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading templates</p>;
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
      {filteredTemplates?.map((template, index) => (
        <TemplateDesignPin key={template._id} data={template} index={index} />
      ))}
    </div>
  );
};

export default HomeContainer;
