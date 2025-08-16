# GATE Preparation Master - Enhanced Resources Tab

A comprehensive GATE preparation application with enhanced resources tab featuring intelligent search, YouTube integration, and Wikipedia content display.

## 🚀 Features

### Enhanced Resources Tab
- **Smart Search Bar** with topic-based filtering
- **YouTube Integration** with auto-play functionality
- **Wikipedia Content Display** with accurate topic information
- **Functional Icons** throughout the entire application
- **Topic Dropdown** with direct YouTube search
- **Content Display Panel** for Wikipedia articles

### Core Features
- Comprehensive GATE syllabus coverage
- Progress tracking and analytics
- Study plan management
- PYQ browser and solver
- Resource management system

## 🛠️ Installation

### Prerequisites
- Node.js 22.x or higher
- npm or yarn package manager

### Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd GATE_-Preparation-schedule
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables template:
```bash
cp env.example .env
```

4. Configure environment variables (optional):
   - Edit `.env` file
   - Add YouTube API key if needed (not required for basic functionality)

5. Start development server:
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables
- `REACT_APP_YOUTUBE_API_KEY`: YouTube Data API v3 key (optional)
- `REACT_APP_ENABLE_YOUTUBE`: Enable YouTube features (default: true)
- `REACT_APP_ENABLE_WIKIPEDIA`: Enable Wikipedia features (default: true)

### YouTube API Setup (Optional)
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add the key to your `.env` file

**Note**: The app works without YouTube API key using mock data as fallback.

### Wikipedia API
No configuration needed! Uses public Wikipedia endpoints:
- Summary API: `https://en.wikipedia.org/api/rest_v1/page/summary/{topic}`
- Search API: `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={query}&format=json&origin=*`
- Content API: `https://en.wikipedia.org/w/api.php?action=query&format=json&titles={topic}&prop=extracts&exintro=true&origin=*`

## 📱 Usage

### Enhanced Resources Tab
1. Navigate to the Resources tab
2. Use the smart search bar to find topics
3. Use the topic dropdown to select specific GATE subjects
4. Click YouTube icon for video content
5. Click Wikipedia icon for article content

### Topic Selection
- Browse GATE CS topics by category
- Quick access to popular subjects
- Direct integration with YouTube and Wikipedia

### Search Features
- Real-time search suggestions
- GATE-specific topic filtering
- Recent search history
- Favorite topics management

## 🏗️ Architecture

### Components
- `EnhancedResourcesTab`: Main enhanced resources component
- `YouTubePlayer`: YouTube video player with search
- `WikipediaViewer`: Wikipedia article viewer
- `TopicDropdown`: Topic selection dropdown
- `IconButton`: Consistent icon button system

### API Integration
- `YouTubeAPI`: YouTube search and video management
- `WikipediaAPI`: Wikipedia content fetching
- Error handling and fallback mechanisms
- Rate limiting utilities

### State Management
- React hooks for local state
- Zustand for global state management
- Local storage for user preferences

## 🎨 UI/UX Features

- **Modern Design**: Clean, responsive interface
- **Smooth Animations**: Framer Motion animations
- **Dark/Light Theme**: Theme switching support
- **Responsive Layout**: Mobile-first design
- **Accessibility**: Screen reader support and keyboard navigation

## 🔍 Search Capabilities

### Smart Search
- Topic-based filtering
- Real-time suggestions
- GATE-specific vocabulary
- Multi-source search (resources, topics, descriptions)

### YouTube Integration
- Topic-based video search
- Auto-play functionality
- Custom player controls
- Fullscreen support
- Search result browsing

### Wikipedia Integration
- Direct article fetching
- Search fallback
- Content extraction
- External link support

## 📊 Data Management

### Local Storage
- Recent searches
- Favorite topics
- User preferences
- Study progress

### API Fallbacks
- Mock data for YouTube (when API unavailable)
- Error handling for Wikipedia requests
- Graceful degradation

## 🚀 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/            # UI components
│   ├── EnhancedResourcesTab.tsx
│   ├── YouTubePlayer.tsx
│   ├── WikipediaViewer.tsx
│   └── TopicDropdown.tsx
├── lib/               # Utility functions
│   └── api.ts        # API integration
├── pages/             # Page components
├── stores/            # State management
└── types/             # TypeScript types
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- [ ] Advanced YouTube playlist support
- [ ] Offline content caching
- [ ] Collaborative study groups
- [ ] AI-powered study recommendations
- [ ] Mobile app version
- [ ] Integration with more educational platforms

---

**Built with ❤️ for GATE aspirants**
