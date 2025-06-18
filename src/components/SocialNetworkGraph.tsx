import React, { useEffect, useRef, useState } from 'react';
import { EmotionalAnalysis, EnvironmentalContext } from '../types/whale';
import { SocialNetworkService } from '../services/SocialNetworkService';
import './SocialNetworkGraph.css';

interface Props {
  whaleId: string;
  emotionalAnalysis: EmotionalAnalysis;
  environmentalContext: EnvironmentalContext;
  updateInterval?: number;
}

export const SocialNetworkGraph: React.FC<Props> = ({
  whaleId,
  emotionalAnalysis,
  environmentalContext,
  updateInterval = 5000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [networkService] = useState(() => new SocialNetworkService());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showMetrics, setShowMetrics] = useState<boolean>(false);

  useEffect(() => {
    const processData = () => {
      networkService.updateNetwork(whaleId, emotionalAnalysis, environmentalContext);
      renderNetwork();
    };

    processData();
    const interval = setInterval(processData, updateInterval);
    return () => clearInterval(interval);
  }, [whaleId, emotionalAnalysis, environmentalContext, updateInterval]);

  const renderNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const network = networkService.getNetwork();
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw bonds
    network.bonds.forEach(bond => {
      const sourceNode = network.nodes.find(n => n.id === bond.sourceId);
      const targetNode = network.nodes.find(n => n.id === bond.targetId);
      
      if (sourceNode && targetNode) {
        const x1 = sourceNode.position.x * width;
        const y1 = sourceNode.position.y * height;
        const x2 = targetNode.position.x * width;
        const y2 = targetNode.position.y * height;

        // Draw bond line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = getBondColor(bond.type, bond.strength);
        ctx.lineWidth = bond.strength * 5;
        ctx.stroke();

        // Draw bond type label
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText(bond.type, midX, midY);
      }
    });

    // Draw nodes
    network.nodes.forEach(node => {
      const x = node.position.x * width;
      const y = node.position.y * height;
      const radius = 20;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = getNodeColor(node.emotionalState);
      ctx.fill();
      ctx.strokeStyle = selectedNode === node.id ? '#2196f3' : '#666';
      ctx.lineWidth = selectedNode === node.id ? 3 : 1;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, x, y + radius + 20);
    });

    // Draw metrics for selected node
    if (selectedNode && showMetrics) {
      const metrics = networkService.getNodeMetrics(selectedNode);
      const node = network.nodes.find(n => n.id === selectedNode);
      
      if (node) {
        const x = node.position.x * width;
        const y = node.position.y * height;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(x + 30, y - 60, 150, 80);
        ctx.strokeStyle = '#666';
        ctx.strokeRect(x + 30, y - 60, 150, 80);
        
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Centrality: ${metrics.centrality.toFixed(2)}`, x + 40, y - 40);
        ctx.fillText(`Bonds: ${metrics.bondCount}`, x + 40, y - 20);
        ctx.fillText(`Avg Strength: ${metrics.averageBondStrength.toFixed(2)}`, x + 40, y);
      }
    }
  };

  const getNodeColor = (emotionalState: EmotionalAnalysis): string => {
    const colorMap: { [key: string]: string } = {
      'joy': '#ffeb3b',
      'contentment': '#4caf50',
      'curiosity': '#2196f3',
      'anxiety': '#ff9800',
      'distress': '#f44336'
    };
    return colorMap[emotionalState.primaryEmotion] || '#9e9e9e';
  };

  const getBondColor = (type: string, strength: number): string => {
    const colorMap: { [key: string]: string } = {
      'mentoring': '#9c27b0',
      'caregiving': '#e91e63',
      'play': '#00bcd4',
      'social': '#4caf50'
    };
    const baseColor = colorMap[type] || '#9e9e9e';
    return `${baseColor}${Math.floor(strength * 255).toString(16).padStart(2, '0')}`;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const network = networkService.getNetwork();

    // Check if click is on a node
    const clickedNode = network.nodes.find(node => {
      const nodeX = node.position.x * canvas.width;
      const nodeY = node.position.y * canvas.height;
      const distance = Math.sqrt(
        Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2)
      );
      return distance <= 20; // Node radius
    });

    setSelectedNode(clickedNode?.id || null);
    setShowMetrics(!!clickedNode);
  };

  return (
    <div className="social-network-graph">
      <h3>Social Network</h3>
      <div className="graph-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="network-canvas"
          onClick={handleCanvasClick}
        />
      </div>
      <div className="legend">
        <div className="legend-section">
          <h4>Node Colors</h4>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#ffeb3b' }}></span>
            <span>Joy</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#4caf50' }}></span>
            <span>Contentment</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#2196f3' }}></span>
            <span>Curiosity</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#ff9800' }}></span>
            <span>Anxiety</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#f44336' }}></span>
            <span>Distress</span>
          </div>
        </div>
        <div className="legend-section">
          <h4>Bond Types</h4>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#9c27b0' }}></span>
            <span>Mentoring</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#e91e63' }}></span>
            <span>Caregiving</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#00bcd4' }}></span>
            <span>Play</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: '#4caf50' }}></span>
            <span>Social</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 