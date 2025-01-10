import React, { useState } from 'react'
import {MdLayersClear} from 'react-icons/md'
import {AnimatePresence,motion} from 'framer-motion'
import { slideUpDownWithScale } from '../animations'
import { FiltersData } from '../utils/helpers'
import './Filter.css'
import useFilters from '../hooks/useFilters'
import { useQueryClient } from 'react-query'
const Filter = () => {
    
    const [isClearHovered, setIsClearHovered] = useState(false)
    const {data:filterData,isLoading,isError} = useFilters()

    const queryclient =  useQueryClient()

    const handleFilterValue = (value) => {
        queryclient.setQueryData("globalFilter", {
            ...queryclient.getQueryData("globalFilter"),
            searchTerm: value
        });
    }

    const clearFilter = () => {
      queryclient.setQueryData("globalFilter",{...queryclient.getQueryData("globalFilter"),searchTerm:""});
    }

  return (
    <div className="w-full flex items-center py-4 space-x-4 parent-container">
      {/* Clear All Button */}
      <div
        className="border border-gray-300 rounded-md px-3 py-2 
          cursor-pointer group hover:shadow-md bg-gray-200 relative flex-shrink-0"
        onMouseEnter={() => setIsClearHovered(true)}
        onMouseLeave={() => setIsClearHovered(false)}
        onClick={clearFilter}
      >
        <MdLayersClear className="text-xl text-gray-600 group-hover:text-gray-800 transition-colors" />

        <AnimatePresence>
          {isClearHovered && (
            <motion.div 
              {...slideUpDownWithScale}
              className="absolute -top-8 -left-2 bg-white shadow-md rounded-md px-2 py-1"
            >
              <p className="whitespace-nowrap text-xs text-gray-700">Clear All</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters Section */}
      <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
        {FiltersData &&
          FiltersData.map((item) => (
            <div
            onClick={() => handleFilterValue(item.value)}
              key={item.id}
              className={`border border-gray-300 rounded-md px-6 py-2 cursor-pointer group hover:shadow-md filter-item ${filterData?.searchTerm === item.value ? "bg-gray-200 shadow-md" : "bg-white"}`}
            >
              <p className="text-sm text-gray-700 group-hover:text-gray-900 whitespace-nowrap">
                {item.label}
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Filter