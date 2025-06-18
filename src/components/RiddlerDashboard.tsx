import React, { useEffect, useState } from 'react';
import { RiddlerExplorerService } from '../RiddlerExplorerService';

const riddlerService = new RiddlerExplorerService();

const RiddlerDashboard: React.FC = () => {
  const [markers, setMarkers] = useState<Array<{ id: string; content: string; expiresAt: number }>>([]);
  const [newMarkerContent, setNewMarkerContent] = useState('');

  useEffect(() => {
    const updateMarkers = () => {
      const activeMarkers = riddlerService.getActiveMarkers();
      setMarkers(activeMarkers);
    };

    updateMarkers();
    const interval = setInterval(updateMarkers, 60000); // Update every minute

    riddlerService.on('markerCreated', updateMarkers);
    riddlerService.on('markerArchived', updateMarkers);

    return () => {
      clearInterval(interval);
      riddlerService.removeListener('markerCreated', updateMarkers);
      riddlerService.removeListener('markerArchived', updateMarkers);
    };
  }, []);

  const handleCreateMarker = () => {
    if (newMarkerContent.trim()) {
      riddlerService.createMarker(newMarkerContent, 3600000); // 1 hour lifespan
      setNewMarkerContent('');
    }
  };

  return (
    <div className="riddler-dashboard">
      <h1>Riddler Explorer Dashboard</h1>
      <div className="marker-list">
        <h2>Active Markers</h2>
        {markers.length === 0 ? (
          <p>No active markers.</p>
        ) : (
          <ul>
            {markers.map(marker => (
              <li key={marker.id}>
                {marker.content} (Expires: {new Date(marker.expiresAt).toLocaleString()})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="create-marker">
        <h2>Create New Marker</h2>
        <input
          type="text"
          value={newMarkerContent}
          onChange={(e) => setNewMarkerContent(e.target.value)}
          placeholder="Enter marker content"
        />
        <button onClick={handleCreateMarker}>Create Marker</button>
      </div>
    </div>
  );
};

export default RiddlerDashboard; 