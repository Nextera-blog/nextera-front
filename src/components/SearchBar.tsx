import React, { useEffect, useState } from 'react';
import { Tag } from '../types/api';
import { getAllTags } from '../services/articles';

type SearchBarProps = {
  onSearch: (searchQuery: string, tags: string[]) => void;
};

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [titleSearch, setTitleSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Erreur lors de la récupération des tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(titleSearch, selectedTags);
  };

  return (
    <form onSubmit={handleSearch} className="mb-8 flex flex-col md:flex-col gap-4 w-full max-w-2xl items-center">
      <input
        type="text"
        placeholder="Rechercher par titre..."
        value={titleSearch}
        onChange={(e) => setTitleSearch(e.target.value)}
        className="px-3 py-1 text-center border border-gray-300 shadow-sm rounded-md w-full "
      />

      <div className="flex flex-wrap w-full justify-between">
        {availableTags.map((tag) => (
          <button
            key={tag.tag_id}
            type="button"
            onClick={() => handleTagClick(tag.name)}
            className={`px-3 py-1 text-sm font-semibold ${
              selectedTags.includes(tag.name)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } focus:outline-none`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <button
        type="submit"
      >
        Rechercher
      </button>
    </form>
  );
};