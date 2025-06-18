// Copyright 2024 The Temporal Editioner Contributors
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

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