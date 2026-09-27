import { create } from 'zustand';
import { citizenReports as initialReports, dashboardStats as initialStats } from '../data/mockData';

export const useAppStore = create((set, get) => ({
  // Filters
  selectedCategory: '',
  selectedSeverity: '',
  selectedDistrict: '',
  dateRange: '30d',
  searchQuery: '',
  
  // Selected items
  selectedHotspot: null,
  selectedReport: null,
  selectedArea: null,
  
  // UI state
  sidebarOpen: true,
  activeLanguage: 'English',
  
  // ─── Citizen Reports (live session data) ──────────────────────────────────────
  citizenReports: [...initialReports],
  
  // ─── Dashboard Stats (session-aware counters) ────────────────────────────────
  dashboardStats: { ...initialStats },

  // Actions — filters
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedSeverity: (severity) => set({ selectedSeverity: severity }),
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  setDateRange: (range) => set({ dateRange: range }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedHotspot: (hotspot) => set({ selectedHotspot: hotspot }),
  setSelectedReport: (report) => set({ selectedReport: report }),
  setSelectedArea: (area) => set({ selectedArea: area }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setLanguage: (lang) => set({ activeLanguage: lang }),
  resetFilters: () => set({
    selectedCategory: '',
    selectedSeverity: '',
    selectedDistrict: '',
    dateRange: '30d',
    searchQuery: '',
  }),

  // ─── Replace dashboard stats with real data from Supabase ───────────────────
  setDashboardStats: (newStats) => set((state) => ({
    dashboardStats: { ...state.dashboardStats, ...newStats },
  })),

  // ─── Set citizen reports from DB ──────────────────────────────────────────────
  setCitizenReports: (reports) => set({ citizenReports: reports }),

  // ─── Add a new citizen report (called after successful submission) ───────────
  addCitizenReport: (report) => set((state) => {
    const newReport = {
      id: report.id || `REQ-${String(Math.floor(Math.random() * 90000) + 10000)}`,
      issue: report.description?.slice(0, 80) || 'New citizen report',
      category: report.category || 'Other',
      location: report.location || 'Not specified',
      district: report.district || 'Not specified',
      coordinates: report.coordinates || [28.6139, 77.2090],
      severity: report.severity || 'Medium',
      language: report.language || 'English',
      date: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      description: report.description || '',
      translatedText: null,
      aiClassification: 'Pending AI Analysis',
      duplicateMatch: false,
      locationConfidence: report.coordinates ? 0.95 : 0.60,
      evidenceCount: report.evidenceCount || 0,
      attachments: report.attachments || [],
      similarReports: [],
    };

    // Update stats
    const updatedStats = { ...state.dashboardStats };
    updatedStats.totalReports += 1;
    if (report.severity === 'Critical' || report.severity === 'High') {
      updatedStats.highPriorityReports += 1;
    }

    return {
      citizenReports: [newReport, ...state.citizenReports],
      dashboardStats: updatedStats,
    };
  }),
}));
