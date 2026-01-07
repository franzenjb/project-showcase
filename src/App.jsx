import { useState, useMemo, useEffect } from 'react'
import projects from './projects.json'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('viewMode') || 'grid'
  })
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('projectRatings')
    return saved ? JSON.parse(saved) : {}
  })
  const [sortBy, setSortBy] = useState('rating')

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem('projectRatings', JSON.stringify(ratings))
  }, [ratings])

  // Get unique tags and statuses
  const allTags = useMemo(() => {
    const tags = new Set()
    projects.forEach(p => p.tags.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [])

  const statuses = ['all', 'Vercel', 'AIStudio', 'GitHub Pages', 'Opal', 'Netlify']

  // Filter and sort projects
  const filtered = useMemo(() => {
    let result = projects.filter(p => {
      const matchesSearch = search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => p.tags.includes(tag))

      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus

      return matchesSearch && matchesTags && matchesStatus
    })

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'rating':
          return (ratings[b.url] || 0) - (ratings[a.url] || 0)
        case 'rating-asc':
          return (ratings[a.url] || 0) - (ratings[b.url] || 0)
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return result
  }, [search, selectedTags, selectedStatus, sortBy, ratings])

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const setRating = (projectUrl, rating) => {
    setRatings(prev => ({
      ...prev,
      [projectUrl]: prev[projectUrl] === rating ? 0 : rating
    }))
  }

  const statusColors = {
    Vercel: '#000',
    AIStudio: '#4285f4',
    'GitHub Pages': '#24292e',
    Opal: '#8e44ad',
    Netlify: '#00ad9f'
  }

  const StarRating = ({ projectUrl, size = 'normal' }) => {
    const currentRating = ratings[projectUrl] || 0
    return (
      <div className={`star-rating ${size}`}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            className={`star ${star <= currentRating ? 'filled' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setRating(projectUrl, star)
            }}
          >
            {star <= currentRating ? '\u2605' : '\u2606'}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header>
        <div className="header-top">
          <h1>Project Showcase</h1>
          <div className="header-controls">
            <button
              className="icon-btn"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            >
              {viewMode === 'grid' ? '\u2630' : '\u25A6'}
            </button>
            <button
              className="icon-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '\u2600' : '\u263D'}
            </button>
          </div>
        </div>
        <p className="subtitle">{projects.length} live projects</p>
      </header>

      <div className="controls">
        <div className="search-row">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search"
          />
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="rating">Rating High-Low</option>
            <option value="rating-asc">Rating Low-High</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="status-filters">
          {statuses.map(status => (
            <button
              key={status}
              className={`status-btn ${selectedStatus === status ? 'active' : ''}`}
              onClick={() => setSelectedStatus(status)}
              style={selectedStatus === status && status !== 'all' ?
                { backgroundColor: statusColors[status], color: '#fff' } : {}}
            >
              {status === 'all' ? 'All' : status}
              {status !== 'all' && ` (${projects.filter(p => p.status === status).length})`}
            </button>
          ))}
        </div>

        <div className="tag-filters">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="results-count">
        Showing {filtered.length} of {projects.length} projects
      </div>

      <div className={viewMode === 'grid' ? 'grid' : 'list'}>
        {filtered.map(project => (
          <div key={project.url} className={`card ${viewMode}`}>
            {viewMode === 'grid' && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="thumbnail-link">
                <div className="thumbnail">
                  <img
                    src={project.screenshot}
                    alt={project.name}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.classList.add('no-image')
                    }}
                  />
                  <div className="placeholder">{project.name.charAt(0)}</div>
                </div>
              </a>
            )}

            <div className="card-content">
              <div className="card-header">
                <h3>
                  {viewMode === 'list' && (
                    <span className="list-initial">{project.name.charAt(0)}</span>
                  )}
                  {project.name}
                </h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: statusColors[project.status] }}
                >
                  {project.status}
                </span>
              </div>

              <StarRating projectUrl={project.url} size={viewMode === 'list' ? 'small' : 'normal'} />

              <p className="description">{project.description}</p>

              <div className="tags">
                {project.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <div className="actions">
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn primary">
                  View Live
                </a>
                {project.editUrl && (
                  <a href={project.editUrl} target="_blank" rel="noopener noreferrer" className="btn secondary">
                    Edit Source
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
