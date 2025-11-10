import React, { useState, useEffect } from 'react';
import { Users, ArrowLeftRight } from 'lucide-react';
import { API } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { IncomingRequestCard, OutgoingRequestCard } from './SwapRequestCard';

const Requests = () => {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) loadRequests();
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const inc = await API.getIncomingRequests();
      const out = await API.getOutgoingRequests();
      setIncoming(inc || []);
      setOutgoing(out || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, accept) => {
    try {
      await API.respondToSwap(requestId, accept);
      loadRequests();
      alert(accept ? "Swap accepted!" : "Swap rejected!");
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading requests...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold", color: "#1a202c", marginBottom: "8px" }}>
          Swap Requests
        </h2>
        <p style={{ color: "#718096" }}>Manage incoming and outgoing swap requests</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div>
          <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2563eb" }}>
            Incoming Requests
          </h3>
          <div style={{ display: "grid", gap: "16px" }}>
            {incoming.length > 0 ? (
              incoming.map((req) => (
                <IncomingRequestCard key={req.id} request={req} onRespond={handleResponse} />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "48px", color: "#9ca3af", background: "white", borderRadius: "12px" }}>
                <Users size={48} style={{ margin: "0 auto 16px" }} />
                <p>No incoming requests</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#16a34a" }}>
            Outgoing Requests
          </h3>
          <div style={{ display: "grid", gap: "16px" }}>
            {outgoing.length > 0 ? (
              outgoing.map((req) => (
                <OutgoingRequestCard key={req.id} request={req} />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "48px", color: "#9ca3af", background: "white", borderRadius: "12px" }}>
                <ArrowLeftRight size={48} style={{ margin: "0 auto 16px" }} />
                <p>No outgoing requests</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;