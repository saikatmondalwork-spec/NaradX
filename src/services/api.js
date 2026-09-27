// NaradX API Service Layer
// Initially returns mock data. Replace with real API calls when backend is ready.

import {
  dashboardStats,
  citizenReports,
  hotspots,
  areaDetails,
  recommendations,
  chartData,
  aiInsights,
  dataSources,
} from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Simulated network delay for realistic UX
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats(filters = {}) {
  await delay(300);
  return { data: dashboardStats, success: true };
}

export async function getChartData(type = 'all') {
  await delay(400);
  return { data: chartData, success: true };
}

// ─── Hotspots ─────────────────────────────────────────────────────────────────

export async function getHotspots(filters = {}) {
  await delay(500);
  let data = [...hotspots];
  if (filters.category) {
    data = data.filter(h => h.primaryCategory === filters.category);
  }
  if (filters.severity) {
    data = data.filter(h => h.severity === filters.severity);
  }
  if (filters.district) {
    data = data.filter(h => h.district === filters.district);
  }
  return { data, success: true };
}

export async function getHotspotById(id) {
  await delay(300);
  const hotspot = hotspots.find(h => h.id === id);
  return { data: hotspot || null, success: !!hotspot };
}

// ─── Area Intelligence ────────────────────────────────────────────────────────

export async function getAreaDetails(id) {
  await delay(500);
  const area = areaDetails[id];
  if (!area) {
    // Return a generated area based on hotspot data
    const hotspot = hotspots.find(h => h.id === id);
    if (hotspot) {
      return {
        data: {
          ...hotspot,
          area_sqkm: 3.2,
          state: 'Delhi',
          country: 'India',
          totalPopulation: hotspot.populationImpacted * 1.15,
          citizenDemandScore: hotspot.priorityScore + 5,
          severityScore: hotspot.urgencyScore,
          demographics: {
            belowPovertyLine: 0.28,
            literacyRate: 0.71,
            femalePopulation: 0.47,
            childPopulation: 0.21,
            seniorPopulation: 0.10,
          },
          existingProjects: [],
          totalInvestment: 0,
          requiredInvestment: 15000000,
          trend: 'increasing',
          monthlyReports: [8, 12, 14, 16, 18, 22, 25, 28, 31, 34, 38, 42],
        },
        success: true,
      };
    }
  }
  return { data: area || null, success: !!area };
}

// ─── Citizen Reports ──────────────────────────────────────────────────────────

export async function getCitizenReports(filters = {}) {
  await delay(400);
  let data = [...citizenReports];
  
  if (filters.category) data = data.filter(r => r.category === filters.category);
  if (filters.severity) data = data.filter(r => r.severity === filters.severity);
  if (filters.status) data = data.filter(r => r.status === filters.status);
  if (filters.language) data = data.filter(r => r.language === filters.language);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    data = data.filter(r =>
      r.issue.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
    );
  }
  
  return { data, total: data.length, success: true };
}

export async function getReportById(id) {
  await delay(300);
  const report = citizenReports.find(r => r.id === id);
  return { data: report || null, success: !!report };
}

export async function submitReport(reportData) {
  await delay(800);
  const newId = `REQ-${String(Math.floor(Math.random() * 90000) + 10000)}`;
  return {
    data: {
      id: newId,
      ...reportData,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
    },
    success: true,
  };
}

// ─── Recommendations ──────────────────────────────────────────────────────────

export async function getRecommendations(filters = {}) {
  await delay(400);
  let data = [...recommendations];
  
  if (filters.category) data = data.filter(r => r.category === filters.category);
  if (filters.urgency) data = data.filter(r => r.urgency === filters.urgency);
  if (filters.status) data = data.filter(r => r.status === filters.status);
  if (filters.minScore) data = data.filter(r => r.priorityScore >= filters.minScore);
  
  // Sort by priority score descending by default
  data.sort((a, b) => b.priorityScore - a.priorityScore);
  
  return { data, success: true };
}

export async function getRecommendationById(id) {
  await delay(300);
  const rec = recommendations.find(r => r.id === id);
  return { data: rec || null, success: !!rec };
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

export async function getAIInsights(query = '') {
  await delay(600);
  if (query) {
    // Find a matching insight or generate a placeholder
    const match = aiInsights.find(i =>
      i.query.toLowerCase().includes(query.toLowerCase().split(' ')[0])
    );
    if (match) return { data: match, success: true };
    
    // Return a generic response for unmatched queries
    return {
      data: {
        id: `AI-${Date.now()}`,
        query,
        answer: `NaradX analysis of available data for query: "${query}". Based on current citizen reports and infrastructure assessments, this area requires further data collection. Current dataset coverage is at 73% for the requested parameters.`,
        keyFindings: [
          'Insufficient data for complete analysis',
          'Recommend expanding data collection in this zone',
          '3 related reports found in adjacent areas',
        ],
        statistics: { reportCount: 12, populationImpacted: 8000, priorityScore: 45 },
        dataSources: ['Citizen Reports Database'],
        confidence: 0.61,
        timestamp: new Date().toISOString(),
      },
      success: true,
    };
  }
  return { data: aiInsights, success: true };
}

// ─── Data Sources ─────────────────────────────────────────────────────────────

export async function getDataSources(category = '') {
  await delay(300);
  let data = [...dataSources];
  if (category) data = data.filter(d => d.category === category);
  return { data, success: true };
}
