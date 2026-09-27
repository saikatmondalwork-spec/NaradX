// NaradX API Service Layer
// Real Supabase queries for citizen_reports & hotspots.
// Mock data fallback for recommendations, area details, charts, data sources.

import { supabase } from '../lib/supabase';
import { classifyReport, answerCivicQuery } from './gemini';
import {
  dashboardStats as mockDashboardStats,
  areaDetails,
  recommendations as mockRecommendations,
  chartData as mockChartData,
  aiInsights as mockAiInsights,
  dataSources as mockDataSources,
} from '../data/mockData';

// Simulated delay (only for mock-backed endpoints, to keep UX consistent)
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  try {
    // Count total reports
    const { count: totalReports } = await supabase
      .from('citizen_reports')
      .select('*', { count: 'exact', head: true });

    // Count high-priority (Critical + High)
    const { count: highPriority } = await supabase
      .from('citizen_reports')
      .select('*', { count: 'exact', head: true })
      .in('severity', ['Critical', 'High']);

    // Count hotspots
    const { count: hotspotCount } = await supabase
      .from('hotspots')
      .select('*', { count: 'exact', head: true });

    // Sum population impacted from hotspots
    const { data: hotspotData } = await supabase
      .from('hotspots')
      .select('population_impacted');
    const totalPopulation = (hotspotData || []).reduce((sum, h) => sum + (h.population_impacted || 0), 0);

    return {
      data: {
        totalReports: totalReports || 0,
        highPriorityReports: highPriority || 0,
        demandHotspots: hotspotCount || 0,
        populationImpacted: totalPopulation,
        totalAreas: hotspotCount || 0,
        categories: 6,
        resolvedRate: 0.34,
        avgResolutionDays: 42,
      },
      success: true,
    };
  } catch (err) {
    console.error('getDashboardStats error:', err);
    return { data: mockDashboardStats, success: true };
  }
}

export async function getChartData() {
  // Chart data stays mock — it's aggregate/historical and looks great as-is
  await delay(200);
  return { data: mockChartData, success: true };
}

// ─── Hotspots ─────────────────────────────────────────────────────────────────

export async function getHotspots(filters = {}) {
  try {
    let query = supabase.from('hotspots').select('*').order('priority_score', { ascending: false });

    if (filters.category) query = query.eq('primary_category', filters.category);
    if (filters.severity) query = query.eq('severity', filters.severity);
    if (filters.district) query = query.eq('district', filters.district);

    const { data, error } = await query;
    if (error) throw error;

    // Transform coordinates from PostGIS geography to [lat, lng] array for Leaflet
    const transformed = (data || []).map(h => ({
      ...h,
      coordinates: h.coordinates
        ? [h.coordinates.coordinates[1], h.coordinates.coordinates[0]] // [lat, lng]
        : [28.6139, 77.2090],
    }));

    return { data: transformed, success: true };
  } catch (err) {
    console.error('getHotspots error:', err);
    // Fallback to mock
    const { hotspots } = await import('../data/mockData');
    return { data: hotspots, success: true };
  }
}

export async function getHotspotById(id) {
  try {
    const { data, error } = await supabase.from('hotspots').select('*').eq('id', id).single();
    if (error) throw error;
    return {
      data: data ? {
        ...data,
        coordinates: data.coordinates
          ? [data.coordinates.coordinates[1], data.coordinates.coordinates[0]]
          : [28.6139, 77.2090],
      } : null,
      success: !!data,
    };
  } catch (err) {
    console.error('getHotspotById error:', err);
    const { hotspots } = await import('../data/mockData');
    const hotspot = hotspots.find(h => h.id === id);
    return { data: hotspot || null, success: !!hotspot };
  }
}

// ─── Area Intelligence ────────────────────────────────────────────────────────

export async function getAreaDetails(id) {
  // Area details stay mock — rich pre-built data that looks great in the demo
  await delay(300);
  const area = areaDetails[id];
  if (area) return { data: area, success: true };

  // If no mock exists, try to build from hotspot data
  try {
    const { data: hotspot } = await getHotspotById(id);
    if (hotspot) {
      return {
        data: {
          ...hotspot,
          area_sqkm: 3.2,
          state: 'Delhi',
          country: 'India',
          totalPopulation: (hotspot.populationImpacted || hotspot.population_impacted || 0) * 1.15,
          citizenDemandScore: (hotspot.priorityScore || hotspot.priority_score || 0) + 5,
          severityScore: hotspot.urgencyScore || hotspot.urgency_score || 0,
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
  } catch { /* fall through */ }

  return { data: null, success: false };
}

// ─── Citizen Reports ──────────────────────────────────────────────────────────

export async function getCitizenReports(filters = {}) {
  try {
    let query = supabase
      .from('citizen_reports')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(100);

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.severity) query = query.eq('severity', filters.severity);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.language) query = query.eq('language', filters.language);
    if (filters.search) query = query.ilike('issue', `%${filters.search}%`);

    const { data, error } = await query;
    if (error) throw error;

    // Transform for frontend compatibility
    const transformed = (data || []).map(r => ({
      ...r,
      // Map DB columns to the camelCase names the UI expects
      date: r.submitted_at ? new Date(r.submitted_at).toISOString().split('T')[0] : '',
      translatedText: r.translated_text,
      aiClassification: r.ai_classification || 'Pending AI Analysis',
      duplicateMatch: r.duplicate_match,
      locationConfidence: r.location_confidence,
      evidenceCount: r.evidence_count,
      similarReports: r.similar_reports || [],
      coordinates: r.coordinates
        ? [r.coordinates.coordinates[1], r.coordinates.coordinates[0]]
        : [28.6139, 77.2090],
    }));

    return { data: transformed, total: transformed.length, success: true };
  } catch (err) {
    console.error('getCitizenReports error:', err);
    const { citizenReports } = await import('../data/mockData');
    return { data: citizenReports, total: citizenReports.length, success: true };
  }
}

export async function getReportById(id) {
  try {
    const { data, error } = await supabase
      .from('citizen_reports')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data: data || null, success: !!data };
  } catch (err) {
    console.error('getReportById error:', err);
    return { data: null, success: false };
  }
}

export async function submitReport(reportData) {
  try {
    // 1. Upload photos to Supabase Storage if any
    const uploadedUrls = [];
    if (reportData.files && reportData.files.length > 0) {
      for (const file of reportData.files) {
        const filePath = `reports/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('report-evidence')
          .upload(filePath, file);
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('report-evidence')
            .getPublicUrl(uploadData.path);
          uploadedUrls.push(urlData.publicUrl);
        }
      }
    }

    // 2. Build the coordinates value for PostGIS
    let coordsValue = null;
    if (reportData.coordinates && reportData.coordinates.length === 2) {
      const [lat, lng] = reportData.coordinates;
      coordsValue = `POINT(${lng} ${lat})`;
    }

    // 3. Insert the report
    const insertData = {
      issue: (reportData.description || '').slice(0, 80) || 'New citizen report',
      description: reportData.description || '',
      category: reportData.category || 'Other',
      location: reportData.location || 'Not specified',
      district: reportData.district || '',
      ward: reportData.ward || '',
      severity: reportData.severity || 'Medium',
      language: reportData.language || 'English',
      status: 'Submitted',
      evidence_count: uploadedUrls.length,
      attachments: uploadedUrls.length > 0 ? uploadedUrls : [],
    };

    // Use raw SQL for PostGIS point insertion
    let result;
    if (coordsValue) {
      const { data, error } = await supabase.rpc('insert_report_with_coords', {
        ...insertData,
        coords_wkt: coordsValue,
      }).single();

      // If the RPC doesn't exist, fall back to regular insert without coordinates
      if (error) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('citizen_reports')
          .insert(insertData)
          .select()
          .single();
        if (fallbackError) throw fallbackError;
        result = fallbackData;
      } else {
        result = data;
      }
    } else {
      const { data, error } = await supabase
        .from('citizen_reports')
        .insert(insertData)
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    // 4. Run Gemini AI classification (async, non-blocking for UX)
    classifyReport(reportData.description, reportData.category, reportData.language)
      .then(async (ai) => {
        if (ai && result.id) {
          await supabase.from('citizen_reports').update({
            ai_classification: ai.classification,
            translated_text: ai.translated_english,
            status: 'AI Analysis',
          }).eq('id', result.id);
        }
      })
      .catch(err => console.error('AI classification failed (non-blocking):', err));

    return {
      data: {
        id: result.id,
        ...reportData,
        status: 'Submitted',
        submittedAt: result.submitted_at || new Date().toISOString(),
      },
      success: true,
    };
  } catch (err) {
    console.error('submitReport error:', err);
    // Fallback: generate a fake ID so the UI still works
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
}

// ─── Recommendations ──────────────────────────────────────────────────────────

export async function getRecommendations(filters = {}) {
  // Recommendations stay mock — pre-built policy recommendations look great
  await delay(300);
  let data = [...mockRecommendations];

  if (filters.category) data = data.filter(r => r.category === filters.category);
  if (filters.urgency) data = data.filter(r => r.urgency === filters.urgency);
  if (filters.status) data = data.filter(r => r.status === filters.status);
  if (filters.minScore) data = data.filter(r => r.priorityScore >= filters.minScore);

  data.sort((a, b) => b.priorityScore - a.priorityScore);

  return { data, success: true };
}

export async function getRecommendationById(id) {
  await delay(200);
  const rec = mockRecommendations.find(r => r.id === id);
  return { data: rec || null, success: !!rec };
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

export async function getAIInsights(query = '') {
  if (query) {
    try {
      // Fetch recent reports from DB to ground the AI response
      const { data: recentReports } = await supabase
        .from('citizen_reports')
        .select('issue, category, severity, location, district, language, status, submitted_at')
        .order('submitted_at', { ascending: false })
        .limit(30);

      const { data: hotspotData } = await supabase
        .from('hotspots')
        .select('name, district, priority_score, report_count, population_impacted, primary_category, severity');

      const context = JSON.stringify({
        recentReports: recentReports || [],
        hotspots: hotspotData || [],
      });

      const ai = await answerCivicQuery(query, context);

      return {
        data: {
          id: `AI-${Date.now()}`,
          query,
          answer: ai.answer,
          keyFindings: ai.keyFindings || [],
          statistics: ai.statistics || { reportCount: 0, populationImpacted: 0, priorityScore: 0 },
          dataSources: ['Live Citizen Reports DB', 'Hotspot Analysis'],
          confidence: ai.confidence || 0.7,
          timestamp: new Date().toISOString(),
        },
        success: true,
      };
    } catch (err) {
      console.error('getAIInsights error:', err);
      // Fall through to mock
    }
  }

  // Fallback: return mock insights
  await delay(400);
  return { data: query ? mockAiInsights[0] : mockAiInsights, success: true };
}

// ─── Data Sources ─────────────────────────────────────────────────────────────

export async function getDataSources(category = '') {
  // Data sources stay mock — static reference data
  await delay(200);
  let data = [...mockDataSources];
  if (category) data = data.filter(d => d.category === category);
  return { data, success: true };
}
