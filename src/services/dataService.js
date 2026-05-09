
// Data Service using PHP API (MySQL)

const API_BASE_URL = '/api/index.php';

const STORAGE_KEYS = {
  PARTICIPANTS: 'participants',
  PROGRAMS: 'programs',
  GALLERY: 'gallery',
  ARTICLES: 'articles',
  DOCUMENTS: 'documents',
  TEAMS: 'teams',
  SETTINGS: 'settings',
};

// Helper for Fetch
const apiRequest = async (method, table, data = null, id = null) => {
  let url = `${API_BASE_URL}?table=${table}`;
  if (id) {
    url += `&id=${id}`;
  }

  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

  let effectiveMethod = method;
  if (isFormData && (method === 'PUT' || method === 'DELETE')) {
    effectiveMethod = 'POST';
    if (!data.has('_method')) data.append('_method', method);
  }

  const options = { method: effectiveMethod };
  if (!isFormData) {
    options.headers = { 'Content-Type': 'application/json' };
  }

  if (data) {
    options.body = isFormData ? data : JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.statusText} - ${errorText}`);
  }

  return response.json();
};

export const dataService = {
  authLogin: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const parsed = JSON.parse(errorText);
        if (parsed?.error) {
          throw new Error(parsed.error);
        }
      } catch {
        // ignore
      }
      throw new Error(errorText || response.statusText);
    }

    return response.json();
  },
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}?action=login_any`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const parsed = JSON.parse(errorText);
        if (parsed?.error) {
          throw new Error(parsed.error);
        }
      } catch {
        // ignore
      }
      throw new Error(errorText || response.statusText);
    }

    return response.json();
  },
  adminLogin: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}?action=admin_login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const parsed = JSON.parse(errorText);
        if (parsed?.error) {
          throw new Error(parsed.error);
        }
      } catch {
        // ignore
      }
      throw new Error(errorText || response.statusText);
    }

    return response.json();
  },
  // Generic Get
  getAll: async (key) => {
    try {
      return await apiRequest('GET', key);
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      return [];
    }
  },
  getAllStrict: async (key) => {
    return apiRequest('GET', key);
  },

  // Generic Add
  add: async (key, item) => {
    try {
      return await apiRequest('POST', key, item);
    } catch (error) {
      console.error(`Error adding to ${key}:`, error);
      throw error;
    }
  },

  // Generic Update
  update: async (key, id, updates) => {
    try {
      return await apiRequest('PUT', key, updates, id);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      throw error;
    }
  },

  // Generic Delete
  delete: async (key, id) => {
    try {
      await apiRequest('DELETE', key, null, id);
      return true;
    } catch (error) {
      console.error(`Error deleting from ${key}:`, error);
      throw error;
    }
  },

  // Save All (for reordering - specific to tables with 'sort_order' column like teams)
  saveAll: async (key, dataList) => {
    try {
      // PHP API doesn't have batch update yet, so we loop requests (less efficient but works for small lists)
      // Ideally, create a bulk update endpoint.
      const updates = dataList.map((item, index) => {
        return apiRequest('PUT', key, { sort_order: index }, item.id);
      });

      await Promise.all(updates);
      return dataList;
    } catch (error) {
      console.error(`Error reordering ${key}:`, error);
      throw error;
    }
  },

  // Keys
  KEYS: STORAGE_KEYS
};
