import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { DataContext } from './dataContext';

export const DataProvider = ({ children }) => {
  const [participants, setParticipants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [articles, setArticles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const refreshData = async () => {
    setLoading(true);
    try {
      const [pData, prData, gData, aData, dData, bData, tData] = await Promise.all([
        dataService.getAll(dataService.KEYS.PARTICIPANTS),
        dataService.getAll(dataService.KEYS.PROGRAMS),
        dataService.getAll(dataService.KEYS.GALLERY),
        dataService.getAll(dataService.KEYS.ARTICLES),
        dataService.getAll(dataService.KEYS.DOCUMENTS),
        dataService.getAll('broadcasts'), // New key
        dataService.getAll(dataService.KEYS.TEAMS),
      ]);

      setParticipants(pData);
      setPrograms(prData);
      setGallery(gData);
      setArticles(aData);
      setDocuments(dData);
      setBroadcasts(bData);
      setTeams(tData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // CRUD Helpers
  const addParticipant = async (data) => {
    await dataService.add(dataService.KEYS.PARTICIPANTS, data);
    refreshData();
  };

  const updateParticipant = async (id, data) => {
    await dataService.update(dataService.KEYS.PARTICIPANTS, id, data);
    refreshData();
  };

  const deleteParticipant = async (id) => {
    await dataService.delete(dataService.KEYS.PARTICIPANTS, id);
    refreshData();
  };

  // Add similar helpers for other entities as needed
  const addProgram = async (data) => {
    await dataService.add(dataService.KEYS.PROGRAMS, data);
    refreshData();
  };
  
  const updateProgram = async (id, data) => {
    await dataService.update(dataService.KEYS.PROGRAMS, id, data);
    refreshData();
  };

  const deleteProgram = async (id) => {
    await dataService.delete(dataService.KEYS.PROGRAMS, id);
    refreshData();
  };

  const reorderPrograms = async (newOrder) => {
    await dataService.saveAll(dataService.KEYS.PROGRAMS, newOrder);
    refreshData();
  };

  const addArticle = async (data) => {
    await dataService.add(dataService.KEYS.ARTICLES, data);
    refreshData();
  };

  const updateArticle = async (id, data) => {
    await dataService.update(dataService.KEYS.ARTICLES, id, data);
    refreshData();
  };

  const deleteArticle = async (id) => {
    await dataService.delete(dataService.KEYS.ARTICLES, id);
    refreshData();
  };
  
  const addGalleryItem = async (data) => {
    await dataService.add(dataService.KEYS.GALLERY, data);
    refreshData();
  };

  const deleteGalleryItem = async (id) => {
    await dataService.delete(dataService.KEYS.GALLERY, id);
    refreshData();
  };

  const addDocument = async (data) => {
    await dataService.add(dataService.KEYS.DOCUMENTS, data);
    refreshData();
  };

  const deleteDocument = async (id) => {
    await dataService.delete(dataService.KEYS.DOCUMENTS, id);
    refreshData();
  };

  const addBroadcast = async (data) => {
    await dataService.add('broadcasts', data);
    refreshData();
  };

  const addTeamMember = async (data) => {
    await dataService.add(dataService.KEYS.TEAMS, data);
    refreshData();
  };

  const updateTeamMember = async (id, data) => {
    await dataService.update(dataService.KEYS.TEAMS, id, data);
    refreshData();
  };

  const deleteTeamMember = async (id) => {
    await dataService.delete(dataService.KEYS.TEAMS, id);
    refreshData();
  };

  const reorderTeamMembers = async (newOrder) => {
    await dataService.saveAll(dataService.KEYS.TEAMS, newOrder);
    refreshData();
  };

  const value = {
    participants,
    programs,
    gallery,
    articles,
    documents,
    broadcasts,
    teams,
    loading,
    refreshData,
    actions: {
      addParticipant,
      updateParticipant,
      deleteParticipant,
      addProgram,
      updateProgram,
      deleteProgram,
      reorderPrograms,
      addArticle,
      updateArticle,
      deleteArticle,
      addGalleryItem,
      deleteGalleryItem,
      addDocument,
      deleteDocument,
      addBroadcast,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      reorderTeamMembers
    }
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
