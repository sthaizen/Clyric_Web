import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { FlaskConical, RotateCcw, Trash2 } from "lucide-react";

// Minimalist, monochromatic node designs with glassmorphism
const CustomNode = ({ id, data, isConnectable }) => {
  const { setNodes, setEdges } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || "Text");

  const onDoubleClick = () => setIsEditing(true);
  const onChange = (e) => setText(e.target.value);

  const onBlur = () => {
    setIsEditing(false);
    if (data.onChange) data.onChange(id, text);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") onBlur();
  };

  const onDelete = (e) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  };

  // Base style: deep dark glassmorphism + 'group' class for hover targeting
  let containerStyle = "group flex items-center justify-center relative min-w-[140px] px-6 py-3 min-h-[48px] shadow-2xl transition-all duration-300 border border-white/10 bg-[#232329]/20 backdrop-blur-xl ";
  let textContainerStyle = "w-full text-center flex items-center justify-center ";

  if (data.shape === "startEnd") {
    containerStyle += " rounded-full";
  } else if (data.shape === "inputOutput") {
    containerStyle += " -skew-x-[15deg] rounded-lg px-8";
    textContainerStyle += " skew-x-[15deg]";
  } else if (data.shape === "decision") {
    // FIX: Changed bg-[#0b0b0c]/80 to match your new base bg-[#232329]/20
    containerStyle = "group flex items-center justify-center w-[100px] h-[100px] transform rotate-45 border border-white/10 bg-[#232329]/20 shadow-2xl rounded-2xl transition-all duration-300 backdrop-blur-xl relative";
    textContainerStyle += " -rotate-45";
  } else {
    // Process
    containerStyle += " rounded-xl";
  }

  // Subtle accent glow on hover
  containerStyle += " hover:shadow-[0_0_25px_rgba(255,255,255,0.05)] hover:border-white/20";

  return (
    <div className={containerStyle} onDoubleClick={onDoubleClick}>
      {/* Delete Button - Appears on hover */}
      <button
        onClick={onDelete}
        className={`absolute -top-2 -right-2 w-5 h-5 bg-[#1b1b1f] border border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all z-50 shadow-xl ${data.shape === 'decision' ? '-rotate-45 -mt-3 -mr-3' : ''}`}
        title="Delete node"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className={`w-2 h-2 bg-[#3e3e42] border-none rounded-full transition-transform hover:scale-150 z-10 ${data.shape === 'decision' ? '-rotate-45 -mt-2 -ml-2' : '-mt-1'}`}
      />

      <div className={textContainerStyle}>
        {isEditing ? (
          <input
            autoFocus
            value={text}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="bg-black/40 border border-[#2cbb5d]/50 text-center outline-none w-full text-white text-[13px] font-medium py-1 px-2 rounded-lg shadow-inner focus:border-[#2cbb5d] focus:ring-1 focus:ring-[#2cbb5d]/50 transition-all"
          />
        ) : (
          <div className="text-[#e1e1e3] text-[13px] font-medium font-sans tracking-wide leading-snug break-words max-w-full select-none pointer-events-none">
            {text}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className={`w-2 h-2 bg-[#2cbb5d] border-none rounded-full transition-transform hover:scale-150 shadow-[0_0_10px_rgba(44,187,93,0.4)] z-10 ${data.shape === 'decision' ? '-rotate-45 -mb-2 -mr-2' : '-mb-1'}`}
      />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

let idCounter = 0;
const getId = () => `node_${idCounter++}`;

export default function SolutionsDiagramTab({ currentProblemId, problem }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const handleNodeTextChange = useCallback((nodeId, newText) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, label: newText };
        }
        return node;
      })
    );
  }, [setNodes]);

  useEffect(() => {
    if (currentProblemId) {
      const savedFlow = localStorage.getItem(`solution_flow_${currentProblemId}`);
      if (savedFlow) {
        try {
          const flow = JSON.parse(savedFlow);
          if (flow && flow.nodes) {
            const loadedNodes = flow.nodes.map(n => {
              n.data = { ...n.data, onChange: handleNodeTextChange };
              return n;
            });
            setNodes(loadedNodes);
            setEdges(flow.edges || []);
            let highestId = 0;
            flow.nodes.forEach(n => {
              if (n.id.startsWith("node_")) {
                const num = parseInt(n.id.split("_")[1], 10);
                if (!isNaN(num) && num > highestId) highestId = num;
              }
            });
            idCounter = highestId + 1;
            return;
          }
        } catch (e) {
          console.error("Error parsing flow", e);
        }
      }
    }

    idCounter = 1;
    setNodes([{
      id: "node_0",
      type: "custom",
      position: { x: window.innerWidth / 3, y: 100 },
      data: { label: "Start", shape: "startEnd", onChange: handleNodeTextChange },
    }]);
    setEdges([]);
  }, [currentProblemId, setNodes, setEdges, handleNodeTextChange]);

  const saveFlow = useCallback(() => {
    if (reactFlowInstance && currentProblemId) {
      const flow = reactFlowInstance.toObject();
      flow.nodes = flow.nodes.map(n => {
        const { onChange, ...restData } = n.data;
        return { ...n, data: restData };
      });
      localStorage.setItem(`solution_flow_${currentProblemId}`, JSON.stringify(flow));
    }
  }, [reactFlowInstance, currentProblemId]);

  useEffect(() => {
    const timer = setTimeout(() => saveFlow(), 500);
    return () => clearTimeout(timer);
  }, [nodes, edges, saveFlow]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({
    ...params,
    animated: true,
    style: { stroke: '#2cbb5d', strokeWidth: 1.5, opacity: 0.8 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
      color: '#2cbb5d',
    },
  }, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const defaultLabels = {
        startEnd: "End",
        process: "Process",
        inputOutput: "Data",
        decision: "Decision",
      };

      const newNode = {
        id: getId(),
        type: "custom",
        position,
        data: { label: defaultLabels[type] || "Node", shape: type, onChange: handleNodeTextChange },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, handleNodeTextChange]
  );

  const handleReset = () => {
    if (!currentProblemId) return;
    if (window.confirm("Clear all steps and reset?")) {
      idCounter = 1;
      setNodes([{
        id: "node_0",
        type: "custom",
        position: { x: window.innerWidth / 3, y: 100 },
        data: { label: "Start", shape: "startEnd", onChange: handleNodeTextChange },
      }]);
      setEdges([]);
      localStorage.removeItem(`solution_flow_${currentProblemId}`);
    }
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    // Updated background wrapper to #1b1b1f
    <div className="p-0 flex flex-col h-full bg-[#1b1b1f]">
      {/* Top Navigation Bar - Removed transparency to match the solid background */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#1b1b1f] flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-4 h-4 text-[#2cbb5d]" />
          <div>
            <h1 className="text-sm font-semibold text-[#e1e1e3] tracking-wide">FlowChart Workspace</h1>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              Visualize your approach before coding
            </p>
          </div>

        </div>


        <div className="flex items-center gap-4">
          {problem && (
            <span className="text-[11px] bg-white/5 text-gray-400 font-medium px-3 py-1.5 rounded-md border border-white/10 max-w-[160px] truncate">
              {problem.title}
            </span>
          )}
          <button
            onClick={handleReset}
            className="text-[11px] text-gray-400 hover:text-red-400 flex items-center gap-1.5 transition-colors font-medium bg-transparent px-2 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Updated ReactFlow wrapper to #1b1b1f */}
      <div className="flex-1 w-full relative overflow-hidden bg-[#1b1b1f]" ref={reactFlowWrapper}>

        {/* Floating Glassmorphic Toolbar */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 p-2.5 bg-[#1b1b1f]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors cursor-grab"
            onDragStart={(event) => onDragStart(event, "startEnd")}
            draggable title="Start / End"
          >
            <div className="w-6 h-3 rounded-full border border-white/40 bg-transparent" />
          </div>
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors cursor-grab"
            onDragStart={(event) => onDragStart(event, "process")}
            draggable title="Process"
          >
            <div className="w-6 h-4 rounded-sm border border-white/40 bg-transparent" />
          </div>
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors cursor-grab"
            onDragStart={(event) => onDragStart(event, "inputOutput")}
            draggable title="Input / Output"
          >
            <div className="w-6 h-4 -skew-x-[15deg] border border-white/40 bg-transparent" />
          </div>
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors cursor-grab"
            onDragStart={(event) => onDragStart(event, "decision")}
            draggable title="Decision"
          >
            <div className="w-4 h-4 rotate-45 border border-white/40 bg-transparent" />
          </div>
        </div>

        <ReactFlowProvider>
          <div className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ maxZoom: 1 }}
              className="bg-[#16161a]" // Canvas color updated to #1b1b1f
            >
              <Background color="#ffffff" gap={20} size={1} variant="dots" className="opacity-10" />
              <Controls position="bottom-right" className="react-flow__controls-aesthetic" showInteractive={false} />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>

      {/* Global overrides for React Flow built-in controls */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .react-flow__controls-aesthetic {
          background-color: rgba(11, 11, 12, 0.6) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 0 !important;
          padding: 0 !important;
          bottom: 24px !important;
          right: 24px !important;
          margin: 0 !important;
        }
        .react-flow__controls-aesthetic button {
          background-color: transparent !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          fill: #8a8a8e !important;
          width: 36px !important;
          height: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.2s ease !important;
        }
        .react-flow__controls-aesthetic button:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          fill: #ffffff !important;
        }
        .react-flow__controls-aesthetic button:last-child {
          border-bottom: none !important;
        }
        .react-flow__attribution {
          display: none !important;
        }
      `}} />
    </div>
  );
}